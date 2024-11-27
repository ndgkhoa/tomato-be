import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing.',
        })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('Error during authentication:', error)
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token.',
            error: error.message,
        })
    }
}

export default authMiddleware
