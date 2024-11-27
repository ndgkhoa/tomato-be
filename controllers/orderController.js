import Stripe from 'stripe'
import Order from '../models/order.js'
import User from '../models/user.js'

export const OrderController = {
    placeOrder: async (req, res) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173'

        try {
            const newOrder = new Order({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
            })
            await newOrder.save()
            await User.findByIdAndUpdate(req.body.userId, { cartData: {} })

            const line_items = req.body.items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            }))

            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Delivery Charges',
                    },
                    unit_amount: 200,
                },
                quantity: 1,
            })

            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            })

            res.status(200).json({ success: true, session_url: session.url })
        } catch (error) {
            console.error('Error in placeOrder:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to place order.',
                error: error.message,
            })
        }
    },

    verifyOrder: async (req, res) => {
        const { orderId, success } = req.body
        try {
            if (success == 'true') {
                await Order.findByIdAndUpdate(orderId, { payment: true })
                res.status(200).json({
                    success: true,
                    message:
                        'Payment successful. The order has been marked as paid.',
                })
            } else {
                await Order.findByIdAndDelete(orderId)
                res.status(200).json({
                    success: false,
                    message:
                        'Payment failed or canceled. The order has been deleted.',
                })
            }
        } catch (error) {
            console.error('Error in verifyOrder:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to verify order.',
                error: error.message,
            })
        }
    },

    getUserOrders: async (req, res) => {
        const { userId } = req.body
        try {
            const orders = await Order.find({ userId })
            res.status(200).json({
                success: true,
                message: 'User orders fetched successfully',
                data: orders,
            })
        } catch (error) {
            console.error('Error in getUserOrders:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders.',
                error: error.message,
            })
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()

            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data: orders,
            })
        } catch (error) {
            console.error('Error fetching orders:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to fetch orders',
                error: error.message,
            })
        }
    },

    updateStatus: async (req, res) => {
        const { orderId, status } = req.body
        try {
            await Order.findByIdAndUpdate(orderId, { status })
            res.status(200).json({
                success: true,
                message: `Order status updated successfully to '${status}'`,
            })
        } catch (error) {
            console.error('Error updating order status:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to update order status',
                error: error.message,
            })
        }
    },

    calculateMonthlyRevenue: async (req, res) => {
        try {
            const revenues = await Order.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: { $toDate: '$createdAt' } },
                            month: { $month: { $toDate: '$createdAt' } },
                        },
                        totalRevenue: { $sum: '$amount' },
                        ordersCount: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1,
                    },
                },
            ])

            res.status(200).json({
                success: true,
                message: 'Monthly revenues fetched successfully',
                data: revenues.map((item) => ({
                    year: item._id.year,
                    month: item._id.month,
                    totalRevenue: item.totalRevenue.toFixed(2),
                    ordersCount: item.ordersCount,
                })),
            })
        } catch (error) {
            console.error('Error calculating monthly revenues:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to calculate monthly revenues',
                error: error.message,
            })
        }
    },
}
