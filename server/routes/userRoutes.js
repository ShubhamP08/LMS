import {Router} from 'express'
const router=Router()
import { register,login,getDetails,logout,forgotpassword,resetpassword,changePassword,updateUser } from '../controllers/userController.js'
import {isLoggedIn} from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multerMiddleware.js'


router.post('/register',upload.single('profileImage'),register)
router.post('/login',login)
router.get('/getdetails',isLoggedIn,getDetails)
router.post('/logout',logout)
router.post('/reset',forgotpassword)
router.post('/reset/:token',resetpassword)
router.post('/change-password',isLoggedIn,changePassword)
router.put('/update',isLoggedIn,upload.single('profileImage'),updateUser)

export default router