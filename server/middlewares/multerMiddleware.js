import path from 'path'
import multer from 'multer'

const upload = multer({
    dest:"uploads/",
    limits: {fileSize: 1024 * 1024 * 100},
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname).toLowerCase()
        console.log(ext)
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf' && ext !== '.m0v' && ext !== '.mp4'){
            return cb(new Error('Only images, pdfs, and videos are allowed'))
        }
        cb(null, true)
    }
})

export default upload