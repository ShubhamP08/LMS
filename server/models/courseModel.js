import {model,Schema} from 'mongoose'

const courseSchema=new Schema({
    title:{
        type:String,
        required:true,
        minLength:[5,'Title must be atleast 5 characters'],
        maxLength:[100,'Title should be less than 100 characters'],
        trim:true
    },
    description:{
        type:String,
        required:true,
        minLength:[10,'Description must be atleast 10 characters'],
        maxLength:[200,'Description should be less than 200 characters'],
        trim:true
    },
    category:{
        type:String,
        required:[true,'Category is required'],
    },
    thumbnail:{
        public_id:{type:String,required:true},
        secure_url:{type:String,required:true}
    },
    lectures:[
        {
            title:{type:String,required:true},
            description:{type:String,trim:true},
            video:{
                public_id:{type:String,required:true},
                secure_url:{type:String,required:true}
            }
        }
    ],
    numberOfLectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        // ref:'User',
        required:true
    }
},{
    timestamps:true
})

const Course=model('Course',courseSchema)

export default Course