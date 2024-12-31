import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username required!"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email required!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required"],
        unique: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guest'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User;