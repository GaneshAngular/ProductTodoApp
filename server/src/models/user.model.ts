import {model, Schema} from "mongoose";

 const userSchema=new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    password: {type:String,required:true},
    role: {type:String,required:true},
    refreshToken:{type:String},
    isActive: {type: Boolean, default: true}
})
const userModel=model('user',userSchema)
export default userModel