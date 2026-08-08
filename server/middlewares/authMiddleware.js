import jwt from 'jsonwebtoken'
import AppError from '../utils/errorUtil.js'
import User from '../models/userModel.js'

const isLoggedIn=async(req,res,next)=>{
    
    const token=req.cookies.token
    if(!token){
        return next(new AppError('Unauthenticated, please login to access this resource',401))
    }
    try {
        console.log("Token:", req.cookies.token);
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log("DECODED:", decoded)
        const user=await User.findById(decoded._id)
        console.log("USER:", user)
        if(!user){
            return next(new AppError('User not found, please login again',404))
        }
        req.user=user
        next()
    } catch (error) {
        return next(new AppError('Invalid token, please login again',401))
    }
}

const authorizeRoles=(...roles)=>(req,res,next)=>{
            const currUserRole=req.user.role
            console.log("Current User Role:", currUserRole);
            if(!roles.includes(currUserRole)){
                return next(new AppError('Unauthorized, you do not have permission to access this resource',403))
            }
            next()
}

const authorizedSubcriber=(req,res,next)=>{
    const subscriptionStatus=req.user.subscription
    const userRole=req.user.role
    if(userRole!=="ADMIN" && subscriptionStatus?.status!=="active"){
        return next(new AppError('Unauthorized, you need an active subscription to access this resource',403))
    }
    next()
}
    
export { isLoggedIn, authorizeRoles, authorizedSubcriber }