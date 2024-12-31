import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    status: {
        type: String,
        enum: ['In progress', 'Completed', 'Cancelled'],
        default: 'In Progress'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)

export default Task