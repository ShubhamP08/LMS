import { Schema,model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        minLength:[5,'Name must be atleast 5 characters'],
        maxLength:[50,'Name should be less than 50 characters'],
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,
        match:[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,'Please fill valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        minLength:[8,'Password must be atleast 8 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String
        }
    },
    role:{
        type:'String',
        enum:['USER','ADMIN'],
        default:'USER'
    },
    subscription:{
        id:String,
        status:String
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiryDate:{
        type:Date
    }
},{
    timestamps:true
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return 
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods={
    getJWTToken:async function(){
        return await jwt.sign(
            {_id:this._id,email:this.email,subscription:this.subscription},
            process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE
        })
    },
    getResetPasswordToken:function(){
        const resetToken=crypto.randomBytes(20).toString('hex')
        this.forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
        this.forgotPasswordExpiryDate=Date.now()+30*60*1000
        return resetToken
    }
}
const User = model('user',userSchema)
export default User