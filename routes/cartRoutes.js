import express from 'express'
import { CartController } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, CartController.getCart)
router.post('/', authMiddleware, CartController.addToCart)
router.put('/', authMiddleware, CartController.removeFromCart)

export default router
