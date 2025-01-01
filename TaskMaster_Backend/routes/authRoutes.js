import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

const generateToken = (id, role) => {
    return jwt.sign({ user: id, role }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    
    try {
        const userExists = await User.findOne({ email })

        if (userExists){
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        const user = await User.create({ username, email, password, role })

        if (user){
            return res.status(201).json({
                message: "User created successfully"
            })
        } else {
            return res.status(400).json({
                message: 'Invalid user data'
            })
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: 'Server error'
        })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password')
      
        if (user && (await user.matchPassword(password))){
            const token = generateToken(user._id, user.role)

            res.cookie('token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                 
                maxAge: 3600000 // 1 hour
            });

            user.password = undefined

            return res.status(200).json({
                message: 'Log In successful.'
            })
        } else {
            return res.status(401).json({
                message:'Invalid email or password'
            })
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: 'Server error'
        })
    }
})

router.get('/current-user', protect, async (req, res) => {

    try {
        const user = await User.findById({ _id: req.user }) 

        if (!user){
            return res.status(401).json({
                message: "Access Denied!"
            })
        }

        
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({
            message: "Internal server error."
        })
    }
    
})

router.post('/logout', (req, res) => {
    try {
    
        res.cookie('token', '', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            expires: new Date(0) 
        });

        return res.status(200).json({
            message: 'Logged out successfully.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during logout'
        });
    }
});


export default router