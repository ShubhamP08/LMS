import AppError from "../utils/errorUtil.js"
import User from "../models/userModel.js"
import cloudinary from 'cloudinary'
import fs from 'fs'
import bcrypt from 'bcrypt'
import sendEmail from "../utils/sendMailUtil.js"
import crypto from 'crypto'
const register= async (req,res,next) =>{
    const {fullname,email,password,confirmpass}=req.body
    if(!fullname || !email || !password || !confirmpass){
        return next(new AppError('All fields are Required',400))
    }
    if(password!==confirmpass){
        return next(new AppError('Password and Confirm Password do not match',400))
    }
    const userExits=await User.findOne({email})
    if(userExits){
        return next(new AppError('User already exists',400))
    }

    const user= new User({
        name:fullname,
        email:email,
        password:password,
        avatar:{
            public_id: req.file ? req.file.filename : 'dummy_avatar_id',
            secure_url: req.file ? req.file.path : 'https://res.cloudinary.com/dpxs5g3w8/image/upload/v1692345093/LMS/default_avatar_qt5gjo.jpg'
        }
    })
    if(!user){
        return next(new AppError('Failed to create user',500))
    }
    console.log('file details',JSON.stringify(req.file))
    if(req.file){
        try {
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'LMS',
                width:250,
                height:250,
                gravity:'face',
                crop:'fill'
            })
            if(result){
                user.avatar.public_id=result.public_id
                user.avatar.secure_url=result.secure_url
                fs.rm(`uploads/${req.file.filename}`, (err) => {
                    if (err) console.log(err)
                })
            }
        } catch (err) {
            return next(new AppError('Failed to upload profile image',500))
        }
    }
    await user.save()
    user.password=undefined
    const token=await user.getJWTToken()
    res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        maxAge:7*24*60*60*1000
    })
    res.status(201).json({
        success:true,
        message:'User registered successfully',
        user
    })
    
}

const login=async(req,res,next)=>{
        try{
        const {email,password}=req.body
        if(!email || !password){
            return next(new AppError('All fields are Required',400))
        }
        const user=await User.findOne({email}).select('+password')
        if(!user){
            return next(new AppError('Invalid email or password',401))
        }
        const isPasswordMatched=await bcrypt.compare(password,user.password)
        if(!isPasswordMatched){
            return next(new AppError('Invalid email or password',401))
        }
        user.tokenVersion+=1;
        await user.save();
        user.password=undefined
        const token=await user.getJWTToken()
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge:7*24*60*60*1000
        })
        res.status(200).json({
            success:true,
            message:'User logged in successfully',
            user
        })
    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const getDetails=async (req,res,next)=>{
    try {
        const userId=req.user._id
        const user=await User.findById(userId)
        res.status(200).json({
            success:true,
            user:req.user
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const logout=(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({
        success:true,
        message:'User logged out successfully'
    })
}

const forgotpassword=async (req,res,next)=>{
    const {email}=req.body
    if(!email){
        return next(new AppError('Email is required',400))
    }
    const user=await User.findOne({email})
    if(!user){
        return next(new AppError('User not found with this email',404))
    }

    const resetToken=await user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})
    const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
    try {
        await sendEmail({
            email:user.email,
            subject:'Password Reset Request',
            message:`You have requested for password reset. Please click on the link to reset your password: ${resetUrl}`
        })
    } catch (error) {
        console.log("EMAIL ERROR:", error)
        user.forgotPasswordToken=undefined
        user.forgotPasswordExpiryDate=undefined
        await user.save({validateBeforeSave:false})
        return next(new AppError('Failed to send email',500))
    }
    console.log('Reset Password URL:', resetUrl)
    res.status(200).json({
        success:true,
        message:'Password reset link has been sent to your email'
    })
}

const resetpassword=async (req,res,next)=>{
    const { token } = req.params
    const { password, confirmpass } = req.body

    if(!password || !confirmpass){
        return next(new AppError('All fields are Required',400))
    }

    if(password !== confirmpass){
        return next(new AppError('Password and Confirm Password do not match',400))
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiryDate: { $gt: Date.now() }
    })

    if(!user){
        return next(new AppError('Invalid or expired token',400))
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiryDate = undefined

    await user.save()

    res.status(200).json({
        success:true,
        message:'Password reset successfully'
    })
}

const changePassword=async (req,res,next)=>{
    try{
        const userId=req.user._id
        const {oldPassword,newPassword,confirmNewPassword}=req.body

        if(!oldPassword || !newPassword || !confirmNewPassword){
            return next(new AppError('All fields are Required',400))
        }

        if(newPassword !== confirmNewPassword){
            return next(new AppError('New Password and Confirm New Password do not match',400))
        }

        const user=await User.findById(userId).select('+password')
        const isOldPasswordMatched=await bcrypt.compare(oldPassword,user.password)
        if(!isOldPasswordMatched){
            return next(new AppError('Old password is incorrect',400))
        }

        user.password=newPassword
        await user.save()

        res.status(200).json({
            success:true,
            message:'Password changed successfully'
        })
    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const updateUser=async (req,res,next)=>{
    const {fullname}=req.body
    const id=req.user._id

    const user=await User.findById(id)
    if(!user){
        return next(new AppError('User not found',404))
    }

    if(fullname){
        user.name=fullname
    }

    if(req.file){
        try {
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'LMS',
                width:250,
                height:250,
                gravity:'face',
                crop:'fill'
            })
            if(result){
                if(user.avatar.public_id && user.avatar.public_id !== 'dummy_avatar_id'){
                    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
                }
                user.avatar.public_id=result.public_id
                user.avatar.secure_url=result.secure_url
                fs.rmSync(`uploads/${req.file.filename}`)
            }
        } catch (err) {
            return next(new AppError('Failed to upload profile image',500))
        }
    }

    await user.save()
    res.status(200).json({
        success:true,
        message:"User details updated Successfully!"
    })
}

export {
    register,
    login,
    getDetails,
    logout,
    forgotpassword,
    resetpassword,
    changePassword,
    updateUser
}
