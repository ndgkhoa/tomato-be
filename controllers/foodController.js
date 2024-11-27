import Food from '../models/food.js'
import cloudinary from '../config/cloudinary.js'

export const FoodController = {
    createFood: async (req, res) => {
        try {
            const imageUrl = req.file.path

            const newFood = new Food({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: imageUrl,
            })

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

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: 'Food not found',
                })
            }

            const publicId = food.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(`foods/${publicId}`)

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
