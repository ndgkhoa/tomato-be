import validator from 'validator'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import createToken from '../utils/tokenUtils.js'

export const UserController = {
    loginUser: async (req, res) => {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res
                    .status(401)
                    .json({ success: false, message: 'Incorrect password' })
            }

            const token = createToken(user._id)
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
            })
        } catch (error) {
            console.error('Error during login:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to login user',
                error: error.message,
            })
        }
    },

    registerUser: async (req, res) => {
        const { name, password, email } = req.body

        try {
            const exists = await User.findOne({ email })
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists',
                })
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                })
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters long',
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            })

            const user = await newUser.save()
            const token = createToken(user._id)
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
            })
        } catch (error) {
            console.error('Error registering user:', error)
            res.status(500).json({
                success: false,
                message: 'Failed to register user',
                error: error.message,
            })
        }
    },
}
