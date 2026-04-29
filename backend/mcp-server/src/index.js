import 'dotenv/config'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'
import mongoose from 'mongoose'
import { studentTools } from './tools/student.tools.js'
import { z } from 'zod'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001

const server = new McpServer({
  name: 'eduai-mcp-server',
  version: '1.0.0'
})

// Enregistrer tous les outils
for (const tool of studentTools) {
  const shape = {}
  for (const [key, val] of Object.entries(tool.inputSchema.properties)) {
    shape[key] = val.type === 'string' ? z.string() : z.any()
  }
  server.tool(tool.name, tool.description, shape, async (args) => {
    const result = await tool.handler(args)
    return { content: [{ type: 'text', text: JSON.stringify(result) }] }
  })
}

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  res.on('close', () => transport.close())
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connecté')
    app.listen(PORT, () => console.log(`MCP Server démarré sur le port ${PORT}`))
  })
  .catch(err => {
    console.error('Erreur MongoDB:', err.message)
    process.exit(1)
  })
