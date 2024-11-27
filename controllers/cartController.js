import User from '../models/user.js'

export const CartController = {
    addToCart: async (req, res) => {
        const { userId, itemId } = req.body

        try {
            const userData = await User.findById(userId)
            const cartData = userData.cartData
            cartData[itemId] = (cartData[itemId] || 0) + 1
            await User.findByIdAndUpdate(userId, { cartData })
            res.status(200).json({
                success: true,
                message: 'Item added to cart successfully.',
            })
        } catch (error) {
            console.error('Error in addToCart:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to add item to cart.',
                error: error.message,
            })
        }
    },

    removeFromCart: async (req, res) => {
        const { userId, itemId } = req.body

        try {
            const userData = await User.findById(userId)
            const cartData = userData.cartData
            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1
            } else {
                delete cartData[itemId]
            }
            await User.findByIdAndUpdate(userId, { cartData })
            res.status(200).json({
                success: true,
                message: 'Item removed from cart successfully.',
            })
        } catch (error) {
            console.error('Error in removeFromCart:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to remove item from cart.',
                error: error.message,
            })
        }
    },

    getCart: async (req, res) => {
        const { userId } = req.body

        try {
            const userData = await User.findById(userId)
            const cartData = userData.cartData
            res.status(200).json({
                success: true,
                message: 'Cart retrieved successfully.',
                data: cartData,
            })
        } catch (error) {
            console.error('Error in getCart:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cart.',
                error: error.message,
            })
        }
    },
}
