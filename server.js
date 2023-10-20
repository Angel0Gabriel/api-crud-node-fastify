// import { createServer } from 'node:http'

// const server = createServer((req, res) => {
//   res.write('Hello World')

//   return res.end()
// })

// server.listen(3333)

import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'

// import { DatabaseMemory } from './database-memory.js'

const server = fastify()

// const database = new DatabaseMemory()

const database = new DatabasePostgres()

server.post('/videos', async (req, res) => {
  const { title, description, duration } = req.body

  await database.create({
    title,
    description,
    duration,
  })

  return res.status(201).send()
})

server.get('/videos', async (req, res) => {
  const search = req.query.search

  const videos = await database.list(search)

  return videos
})

// Route Parameter (:id)
server.put('/videos/:id', async (req, res) => {
  const videoId = req.params.id
  const { title, description, duration } = req.body

  await database.update(videoId, {
    title,
    description,
    duration
  })

  return res.status(204).send()
})

// Route Parameter (:id)
server.delete('/videos/:id', async (req, res) => {
  const videoId = req.params.id

  await database.delete(videoId)

  return res.status(204).send()
})

server.listen({
  port: process.env.PORT ?? 3333,
})
