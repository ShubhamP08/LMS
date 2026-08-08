import mongoose from 'mongoose'

mongoose.set('strictQuery',false) //ignore when data not available

const connectToDb=async()=>{
    try {
        const {connection} = await mongoose.connect(
            process.env.MONGO_URI
        )
        if(connection){
            console.log(`Connected to DB ${connection.host}`)
        }
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectToDb