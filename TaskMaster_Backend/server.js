import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN_FRONTEND || "http://localhost:5500",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use('/api/auth', authRoutes)
app.use('/api/taskmanager', taskRoutes)

app.get('/', (req, res) => {
    res.send('TaskMaster API is running...')
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!'
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));