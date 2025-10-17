import 'dotenv/config'
import express from 'express'
import {connectDB} from './database/db.js'
import {router as plantsRouter} from './router/plants.js'
import {router as usersRouter} from './router/users.js'

await connectDB();
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
    </html>
  `)
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/plants', plantsRouter)
app.use('/users', usersRouter)

app.use((req, res) => res.sendStatus(404));

export default app