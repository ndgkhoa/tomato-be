import fs from 'fs'
import Food from '../models/food.js'

export const FoodController = {
    createFood: async (req, res) => {
        let image_filename = req.file.filename

        const newFood = new Food({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        })
        try {
            await newFood.save()
            res.status(201).json({
                success: true,
                message: 'Food added successfully',
                data: newFood,
            })
        } catch (error) {
            console.error('Error creating food:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to create food',
                error: error.message,
            })
        }
    },

    getAllFoods: async (req, res) => {
        try {
            const foods = await Food.find()

            res.status(200).json({
                success: true,
                message: 'Foods fetched successfully',
                data: foods,
            })
        } catch (error) {
            console.error('Error fetching foods:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to fetch foods',
                error: error.message,
            })
        }
    },

    deleteFood: async (req, res) => {
        const id = req.body.id

        try {
            const food = await Food.findById(id)
            fs.unlink(`uploads/${food.image}`, () => {})
            await Food.findByIdAndDelete(id)

            res.status(200).json({
                success: true,
                message: 'Food deleted successfully',
                data: food,
            })
        } catch (error) {
            console.error('Error deleting food:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to delete food',
                error: error.message,
            })
        }
    },
}
