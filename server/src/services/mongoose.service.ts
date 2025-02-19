import mongoose from "mongoose"
 import dotenv from 'dotenv'
 dotenv.config()
const connecteDatabase=async()=>{
   
          mongoose.connect(process.env.DATABASE_URL||'').then(()=>{
            console.log('Connection Established')
          }).catch((err:Error)=>{
               console.log(err) 
          })
}

export default connecteDatabase