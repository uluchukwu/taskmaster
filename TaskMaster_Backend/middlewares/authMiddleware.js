import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

// Middleware to protect route (ensure user is logged in)
const protect = (req, res, next) => {

    const token = req.cookies.token
  
    if (!token) {
        return res.status(401).json({
            message: 'Not Authorized to view resource'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded.user
        req.role = decoded.role
        
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Not Authorized to view resource'
        })
    }
}

// Role based access

const roleMiddleware = (role) => (req, res, next) => {
    if (req.role !== role && req.role !== 'admin'){
        return res.status(403).json({
            message: 'Access denied.'
        })
    }
    next ()
}

export { protect, roleMiddleware }