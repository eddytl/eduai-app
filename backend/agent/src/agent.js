import Mistral from '@mistralai/mistralai'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { buildSystemPrompt } from './prompts/tutor.prompt.js'

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

async function getMcpClient() {
  const client = new Client({ name: 'eduai-agent', version: '1.0.0' })
  const transport = new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_URL))
  await client.connect(transport)
  return client
}

async function getStudentProfile(userId) {
  const client = await getMcpClient()
  try {
    const result = await client.callTool({ name: 'get_student_profile', arguments: { user_id: userId } })
    return JSON.parse(result.content[0].text)
  } finally {
    await client.close()
  }
}

export async function chat({ userId, messages }) {
  const student = await getStudentProfile(userId)
  const systemPrompt = buildSystemPrompt(student)

  const response = await mistral.chat.complete({
    model: 'mistral-large-latest',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })

  return {
    reply: response.choices[0].message.content,
    student: { name: student.name, classe: student.classe, serie: student.serie }
  }
}
