import Payment from "../models/paymentModel.js"
import AppError from "../utils/errorUtil.js"
import {razorpay} from '../server.js'
import crypto from "crypto"
import User from "../models/userModel.js"
const getRazorpayKey=async (req,res,next)=>{
    try{
        res.status(201).json({
            success:true,
            message:"Subscription bought successfully",
            key:process.env.RAZORPAY_KEY_ID
        })
    }catch(error){ 
        return next(new AppError(error.message,500))
    }
}

const buySubscription=async (req,res,next)=>{
    try{
        const user=await User.findById(req.user._id)
        if(!user){
            return next(new AppError("User not found",404))
        }
        if(user.role==="ADMIN"){
            return next(new AppError("Admin can't buy subscription",400))
        }
        if(user.subscription && user.subscription.status==="active"){
            return next(new AppError("Already Subscribed",400))
        }
        const subscription=await razorpay.subscriptions.create({
            plan_id:process.env.RAZORPAY_PLAN_ID,
            customer_notify:1,
            total_count:12
        })
        user.subscription={
            id:subscription.id,
            status:subscription.status
        }
        await user.save()
        res.status(201).json({
            success:true,
            message:"Subscription bought successfully",
            subscriptionId:subscription.id
        })
    }catch(error){ 
        console.log("Subscription Failed")
        return next(new AppError(error.message,500))
    }
}

const verifyPayment=async (req,res,next)=>{
    try{
        const {razorpay_payment_id, razorpay_subscription_id, razorpay_signature}=req.body
        const user=await User.findById(req.user._id)
        if(!user){
            return next(new AppError("User not found",404))
        }
        const subscriptionId=user.subscription.id
        const generated_signature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_payment_id+"|"+subscriptionId)
        .digest('hex')
        if(generated_signature!==razorpay_signature){
            return next(new AppError("Payment not Verified",400))
        }
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        })
        user.subscription.status="active"
        await user.save()
        res.status(200).json({
            success:true,
            message:"Payment verified successfully",
        })
    }catch(error){ 
        console.log("Verification Failed")
        return next(new AppError(error.message,500))
    }
}

const cancelSubscription=async (req,res,next)=>{
    try{
        const user=await User.findById(req.user._id)
        if(!user || user.role==="ADMIN"){
            return next(new AppError("User not found",404))
        }
        if(user.subscription.status!=="active"){
            return next(new AppError("No active subscription found",400))
        }
        const subscription=await razorpay.subscriptions.cancel(user.subscription.id)
        user.subscription.status=subscription.status
        await user.save()
        res.status(200).json({
            success:true,
            message:"Subscription cancelled successfully",
        })
    }catch(error){ 
        return next(new AppError(error.message,500))
    }
}

const viewAllPayments=async (req,res,next)=>{
    try{
        const {count}=req.query
        const subscriptions=await razorpay.subscriptions.all({count:count || 10})
        // const payments=await Payment.find({razorpay_subscription_id:subscriptions.items[0].id})
        res.status(200).json({
            success:true,
            message:"Payments fetched successfully",
            subscriptions
        })
    }catch(error){ 
        return next(new AppError(error.message,500))
    }
}

export {buySubscription,verifyPayment,getRazorpayKey,cancelSubscription,viewAllPayments}