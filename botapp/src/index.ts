import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/api', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/healthCheck', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 5000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
