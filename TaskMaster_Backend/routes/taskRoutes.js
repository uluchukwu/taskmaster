import express from 'express'
import { protect, roleMiddleware } from '../middlewares/authMiddleware.js'
import Task from '../models/TaskModel.js'


const router = express.Router()

// Route to create a new task (users can create their own tasks, admins can create tasks for others)
router.post('/tasks', protect, roleMiddleware('user'), async (req, res) => {
    const { title, description, deadline, priority, status } = req.body

    try {
        const newTask = new Task({
            title,
            description,
            deadline,
            priority,
            status,
            createdBy: req.user
        })

        await newTask.save()

        res.status(201).json(newTask)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: 'Error creating task'
        })
    }
})

// Route to get all tasks (admins see all, users see only their tasks)

router.get('/tasks', protect, async (req, res) => {
    try {
        let tasks;
        if (req.role === 'admin'){
            tasks = await Task.find().populate("createdBy", "username role")
        } else {
            tasks = await Task.find({ createdBy: req.user })
        }
        
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tasks.'
        })
    }
})

// Route to get a single task by ID (admins and the task creator can access this)
router.get('/tasks/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task){
            return res.status(404).json({
                message: 'Task not found'
            })
        }

        if (task.createdBy.toString() !==  req.user.toString() && req.role !== 'admin'){
            return res.status(403).json({
                message: 'You do not have permission to view this task.'
            })
        }

        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching task'
        })
    }
})

// Route to update a task (admins can update any task, users can only update their own tasks)

router.put('/tasks/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            })
        }

        if (task.createdBy.toString() !== req.user.toString() && req.role !== 'admin'){
            return res.status(403).json({
                message: 'You do not have permission to edit this task.'
            })
        }

        const { title, description, deadline, priority, status } = req.body;

        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.priority = priority || task.priority;
        task.status = status || task.status,

        await task.save()

        res.status(200).json({
            message: "Task Updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error updating task'
        })
    }
})

// Route to delete a task (admins can delete any task, users can only delete their own tasks)

router.delete('/tasks/:id', protect, async (req, res) => {
    
    try {
        const task = await Task.findById(req.params.id)

        if (!task){
            return res.status(404).json({
                message: 'Task not found'
            })
        }

        if (task.createdBy.toString() !== req.user.toString() && req.role !== 'admin'){
            return res.status(403).json({
                message: 'You do not have permission to delete this task'
            })
        }

        await task.deleteOne()
        res.status(200).json({
            message: 'Task deleted successfully'
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: 'Error deleting task'
        })
    }
})

router.get('/guest/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tasks for guests'
        })
    }
})

export default router