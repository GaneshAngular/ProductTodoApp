import { Request, Response } from "express";
import models from '../models/models';
import User from "../interfaces/user.interface";
import { CREATED, INVALID, NOT_FOUND, OK, SERVER_ERROR, UNAUTHORISE } from "../constants/statusCode";
import { compareHash, createHash } from "../services/bcrypt.service";
import { createRefreshToken, createToken, verifyRefreshToken } from "../services/jwt.service";


const {userModel}=models
const signIn=async(req:Request,res:Response):Promise<any>=>{
   
       try{
           const {email,password}=req.body
           
           const user=await userModel.findOne({email})
           if(!user) return res.status(NOT_FOUND).json({message:"No Account Exist"})
            const isVerified=await compareHash(password,user.password)
           console.log(user)
          
          if(!isVerified)return res.status(INVALID).json({message:"Invalid Login"})
            
            const token=createToken({id:user._id,role:user.role})
            const refreshToken=createRefreshToken({id:user._id,role:user.role})
            if(!token &&!refreshToken) return res.status(SERVER_ERROR).json({message:"Server Error"})
         
            res.cookie('refreshToken',refreshToken,{httpOnly:true,sameSite:'none',secure:true,maxAge:2*60*60*1000})
            // console.log(req.cookies.refreshToken)
            
       return res.status(OK).json({message:"Login Success",token})
       }catch(error){
        return res.json(SERVER_ERROR).json({messgae:"Server error"})
       }
}

const signUp=async(req:Request,res:Response):Promise<any>=>{
             const user:User=req.body
             user.password=await createHash(user.password)
             try {
                 const isExist=await userModel.findOne({email:user.email})
                 console.log(isExist)
                 if(isExist)
                    return res.status(OK).json({message:"Email exist"})
                
                const newUser=await userModel.create(user)
                
                return res.status(CREATED).json({message:"signUp Success"})
            } catch (error) {
                return res.json(SERVER_ERROR).json({messgae:"Server error"})
            }
}

const refreshToken=async(req:Request,res:Response):Promise<any>=>{
    try {
        const refreshToken=req.cookies.refreshToken

              if(req.cookies?.refreshToken){
                const decodeData:any= verifyRefreshToken(refreshToken)
         
                if(!decodeData)
                return res.status(INVALID).json({message:"Not Response"})

                const token=createToken({id:decodeData.id,email:decodeData.email})
                return res.status(200).json({message:"token refresh",token})
              }else{
                return res.status(SERVER_ERROR).json({message:"Server error"})
              }
    } catch (error) {
        // console.log(error)
        return res.status(SERVER_ERROR).json({message:"Server error"})
        
    }
}

const authController={
    signIn,
    signUp,
    refreshToken
}

export default authController