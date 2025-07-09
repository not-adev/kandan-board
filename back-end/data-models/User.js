import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'userName is not given but required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email is not given but required'],
        unique: true
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "todo" }],
    password: {
        type: String,
        required: [true, 'password is not given but required'],
    },
    isVerified: { type: Boolean, default: false },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date }

})

export const Users = mongoose.models.user || mongoose.model('users', userSchema);
