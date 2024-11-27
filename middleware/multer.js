import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'foods',
        allowed_formats: ['jpeg', 'png', 'jpg'],
    },
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     },
// })

const upload = multer({ storage })

export default upload
