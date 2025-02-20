import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String },
    position: { type: String },
    dob: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
    salary:{ type: String},
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true }
})
const userModel = model('user', userSchema)
export default userModel