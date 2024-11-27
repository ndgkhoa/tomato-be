import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { OrderController } from '../controllers/orderController.js'

const router = express.Router()

router.get('/', OrderController.getAllOrders)
router.get('/user', authMiddleware, OrderController.getUserOrders)
router.get('/monthly-revenue', OrderController.calculateMonthlyRevenue)
router.post('/', authMiddleware, OrderController.placeOrder)
router.post('/verify', OrderController.verifyOrder)
router.put('/', OrderController.updateStatus)

export default router
