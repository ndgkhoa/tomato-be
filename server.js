import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
