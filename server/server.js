import dotenv from 'dotenv'
dotenv.config()
import app from './app.js';
import connectToDb from './config/dbconnection.js';
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'
const PORT=process.env.PORT || 5000;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

app.listen(PORT,async ()=>{
    await connectToDb()
    console.log(`Server Running on Port http://localhost:${PORT}...`);
})