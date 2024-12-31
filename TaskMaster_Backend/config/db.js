import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log("Database connected successfully");
        
    } catch (error) {
        console.log('Error connecting to database', error);
        process.exit(1)
        
    }
}

export default connectDB