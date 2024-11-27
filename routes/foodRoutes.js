import express from 'express'
import { FoodController } from '../controllers/foodController.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.get('/', FoodController.getAllFoods)
router.post('/', upload.single('image'), FoodController.createFood)
router.delete('/', FoodController.deleteFood)

export default router
