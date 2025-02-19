import { Request, Response,  } from "express";
import User from "../interfaces/user.interface";
import { createHash } from "../services/bcrypt.service";
import models from "../models/models";
import { CREATED, FOUND, NOT_FOUND, OK, SERVER_ERROR, UNAUTHORISE } from "../constants/statusCode";
import { EMPLOYEE } from "../constants/constants";
import { verifyToken } from "../services/jwt.service";

const{userModel}=models


const getEmployees=async(req:Request,res:Response):Promise<any>=>{
        try {
            const employees=await userModel.find({role:EMPLOYEE})
            if(employees.length==0) return res.status(NOT_FOUND).json({message:"success",data:employees})

          return res.status(FOUND).json({data:employees})
        } catch (error) {
          return res.status(SERVER_ERROR).json({message:"Server error"})
            
        }
}

const addEmployee=async(req:Request,res:Response):Promise<any>=>{
    const user:User=req.body
    try {
        const isExist=await userModel.findOne({email:user.email})
        console.log(isExist)
        if(isExist)
            return res.status(OK).json({message:"Email exist"})
        
        user.password=await createHash(user.password)
        console.log(user)
       const newUser=await userModel.create(user)
       
       return res.status(CREATED).json({message:"Employee Added"})
   } catch (error) {
       return res.json(SERVER_ERROR).json({messgae:"Server error"})
   }
}

const getProfile=async(req:Request,res:Response):Promise<any>=>{
       try{
             const token=req.headers.authorization?.split(' ')[1]||''
             const id:any=verifyToken(token)
             const user=await userModel.findById(id.id)
             return res.status(FOUND).json({data:user})
       }catch(error){
           return res.status(SERVER_ERROR).json({message:"Server error"})
       }
}


const updateProfile=async(req:Request,res:Response):Promise<any>=>{
    const data=req.body
      const token=req.headers.authorization?.split(' ')[1]||''
    try{    
          const id:any=verifyToken(token)
          if(!id)return res.status(UNAUTHORISE).json({message:"Unauthorise"})
          const user=await userModel.findByIdAndUpdate(id.id,data)
          return res.status(FOUND).json({message:"Profile Updated",data})
    }catch(error){
        return res.status(SERVER_ERROR).json({message:"Server error"})
    }
}


const updateEmployee=async(req:Request,res:Response):Promise<any>=>{
      try {
             const {id}=req.query
             const newData=req.body
              const user=await userModel.findByIdAndUpdate(id,newData)
              if(!user)return res.status(NOT_FOUND).json({message:"Not Found"})

            return res.status(CREATED).json({message:"Employee Updated"})
      } catch (error) {
        return res.status(SERVER_ERROR).json({message:"Server error"})
      }
}

const deleteEmployee=async(req:Request,res:Response):Promise<any>=>{
    try {
        const {id}=req.query
         const user=await userModel.findByIdAndDelete(id)
         if(!user)return res.status(NOT_FOUND).json({message:"Not Found"})

       return res.status(CREATED).json({message:"Employee Deleted"})
 } catch (error) {
   return res.status(SERVER_ERROR).json({message:"Server error"})
 }
}

const userController={
     addEmployee,
     getProfile,
     getEmployees,
     updateEmployee,
     deleteEmployee,
     updateProfile
}
export default userController