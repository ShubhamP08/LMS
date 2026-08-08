import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import courseRouter from './routes/courseRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))
app.use(cookieParser())
app.use('/ping',(req,res)=>{
    res.send("pong")
})

//3 Mod
app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/payment',paymentRouter)
//if any other url
app.use((req, res) => {
    res.status(404).send("OOPS!! 404 page not found")
})
app.use(errorMiddleware)
export default app