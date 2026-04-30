import { Mistral } from '@mistralai/mistralai'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { buildSystemPrompt } from './prompts/tutor.prompt.js'

const LMS_URL = process.env.LMS_URL || 'http://localhost:1234'
const LMS_MODEL = process.env.LMS_MODEL || 'mistral-7b-instruct-v0.1'
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

const mistral = MISTRAL_API_KEY ? new Mistral({ apiKey: MISTRAL_API_KEY }) : null

async function getMcpClient() {
  const client = new Client({ name: 'eduai-agent', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_URL))
  await client.connect(transport)
  return client
}

async function getStudentProfile(userId) {
  try {
    const client = await getMcpClient()
    try {
      const result = await client.callTool({ name: 'get_student_profile', arguments: { user_id: userId } })
      if (result.isError) {
        console.warn(`Profil non trouvé pour ${userId}: ${result.content[0].text}`)
        return null
      }
      return JSON.parse(result.content[0].text)
    } finally {
      await client.close()
    }
  } catch (err) {
    console.error('Erreur récupération profil:', err.message)
    return null
  }
}

export async function chat({ userId, messages }) {
  const student = await getStudentProfile(userId)
  const systemPrompt = buildSystemPrompt(student)
  const allMessages = [{ role: 'system', content: systemPrompt }, ...messages]

  // Try Mistral first if configured
  if (mistral) {
    try {
      const response = await mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: allMessages
      })
      return {
        reply: response.choices[0].message.content,
        student: student ? { name: student.name, classe: student.classe, serie: student.serie } : null
      }
    } catch (err) {
      console.error('Mistral chat error, falling back to LMS:', err.message)
    }
  }

  // Fallback to LMS
  const response = await fetch(`${LMS_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: LMS_MODEL, messages: allMessages })
  })

  if (!response.ok) throw new Error(`AI Provider error: LMS failed with ${response.status}`)
  const data = await response.json()

  return {
    reply: data.choices[0].message.content,
    student: student ? { name: student.name, classe: student.classe, serie: student.serie } : null
  }
}

export async function chatStream({ userId, messages, onChunk, signal }) {
  const student = await getStudentProfile(userId)
  const systemPrompt = buildSystemPrompt(student)
  const allMessages = [{ role: 'system', content: systemPrompt }, ...messages]

  let response
  try {
    console.log(`Démarrage du flux AI pour l'utilisateur ${userId}...`)
    if (mistral) {
      // Try Mistral via Fetch
      response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({ model: 'mistral-large-latest', messages: allMessages, stream: true })
        // signal supprimé temporairement pour test
      })
      if (!response.ok) throw new Error(`Mistral returned ${response.status}`)
    } else {
      throw new Error('Mistral not configured')
    }
  } catch (err) {
    console.error('Erreur démarrage flux:', err.message)
    // Fallback to LMS
    console.log('Tentative de repli sur LMS...')
    response = await fetch(`${LMS_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: LMS_MODEL, messages: allMessages, stream: true })
    })
    if (!response.ok) throw new Error(`AI Provider error: LMS failed with ${response.status}`)
  }

  console.log('Flux AI établi, lecture des chunks...')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ')) continue
      const raw = trimmed.slice(6).trim()
      if (raw === '[DONE]') {
        console.log('Signal [DONE] reçu du fournisseur AI')
        break
      }
      try {
        const parsed = JSON.parse(raw)
        const delta = parsed.choices[0]?.delta?.content || ''
        if (delta) {
          process.stdout.write(delta)
          onChunk(delta)
        }
      } catch (err) {
        console.error('Erreur parsing chunk:', err.message)
      }
    }
  }
  console.log('\nFlux terminé avec succès.')
}
