import fs from "fs";
import Course from "../models/courseModel.js";
import cloudinary from 'cloudinary'
import AppError from "../utils/errorUtil.js";
const getAllCourses=async (req,res,next)=>{
    try{
        const courses=await Course.find({}).select('-lectures')
        res.status(200).json({
            success:true,
            message:"All courses retrieved successfully",
            courses
        })
    }
    catch(error){
        return next(new AppError(error.message,500))
    }
}

const getCourseDetails=async (req,res,next)=>{
    try{
        const id = req.params.id
        const course=await Course.findById(id)
        if(!course){
            return next(new AppError("Course not found",404))
        }
        res.status(200).json({
            success:true,
            message:"Course details retrieved successfully",
            course:{
                _id:course._id,
                title:course.title,
                description:course.description,
                category:course.category,
                createdBy:course.createdBy,
                numberOfLectures:course.numberOfLectures,
                thumbnail:course.thumbnail,
            },
            lectures:course.lectures
        })
    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const createCourse = async (req,res,next)=>{
    const {title,description,category,createdBy} = req.body

    if(!title || !description || !category || !createdBy){
        return next(new AppError("All fields are required",400))
    }

    try{
        let public_id;
        let secure_url;

        if(req.file){

            const result = await cloudinary.v2.uploader.upload(
                req.file.path,
                { folder:"LMS" }
            )
            if(result){
                public_id = result.public_id
                secure_url = result.secure_url
            }else{
                console.log("Error uploading thumbnail")
            }

            fs.rmSync(`uploads/${req.file.filename}`)
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id,
                secure_url
            }
        })

        res.status(201).json({
            success:true,
            message:"Course created successfully",
            course
        })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const updateCourse=async (req,res,next)=>{
    try{
        const id = req.params.id
        const course=await Course.findByIdAndUpdate(
            id,
            {
                $set:req.body
            },
            {
                runValidators:true,
                new:true
            }
        )
        if(!course){
            return next(new AppError("Course not found",404))
        }
        res.status(200).json({
            success:true,
            message:"Course updated successfully",
            course
        })
    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const deleteCourse=async(req,res,next)=>{
    try {
        const id = req.params.id
        const course=await Course.findByIdAndDelete(id)
        if(!course){
            return next(new AppError("Course not found",404))
        }
        res.status(200).json({
            success:true,
            message:"Course deleted successfully",
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const addLectures=async(req,res,next)=>{
    const {title,description} = req.body
    const id = req.params.id

    if(!title || !description){
        return next(new AppError("All fields are required",400))
    }
    const course=await Course.findById(id)
    if(!course){
        return next(new AppError("Course not found",404))
    }
    const lectureData={
        title,
        description
    }
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(
                req.file.path,
                { resource_type:"video", folder:"LMS" }
            )
            if(result){
                lectureData.video={
                    public_id:result.public_id,
                    secure_url:result.secure_url
                }
            }else{
                console.log("Error uploading video")
            }

            fs.rmSync(`uploads/${req.file.filename}`)
        }catch(error){
            return next(new AppError(error.message,500))
        }
    }

    course.lectures.push(lectureData)
    course.numberOfLectures=course.lectures.length
    await course.save()

    res.status(200).json({
        success:true,
        message:"Lecture added successfully",
        lectures:course.lectures
    })
}

export {getAllCourses,getCourseDetails,createCourse,updateCourse,deleteCourse,addLectures}