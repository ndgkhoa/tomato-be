import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import foodRoutes from './routes/foodRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

app.use('/api/food', foodRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRouter)
//app.use('/images', express.static('uploads'))

connectDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
