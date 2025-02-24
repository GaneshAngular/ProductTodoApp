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
    const query:any = req.query;
     
 
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
  
    
    const skip = (page - 1) * limit;
  
    const order=query.order
    const sortBy =query.sort; 
    
  
    
    const searchPattern = query.search || '';
    const nameRegex = new RegExp(`^${searchPattern}`, 'i'); 
  
   
    const filter = { role: EMPLOYEE, name: { $regex: nameRegex } };
  
    const employees = await userModel.find(filter)
      .skip(skip)        
      .limit(limit)        
      .sort({ [sortBy]:order });  
    
   
    const totalRecords = await userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);
  
    return res.status(OK).json({ data: employees,limit,totalPages });
  
  } catch (error) {
    console.error(error); 
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
  
}

const addEmployee=async(req:Request,res:Response):Promise<any>=>{
    const user:User=req.body
    try {
        const isExist=await userModel.findOne({email:user.email})
      
        if(isExist)
            return res.status(OK).json({message:"Email exist"})
        
        user.password=await createHash(user.password)
       
       const newUser=await userModel.create(user)
       
       return res.status(CREATED).json({message:"Employee Added"})
   } catch (error) {
    console.log(error)
       return res.status(SERVER_ERROR).json({messgae:"Server error"})
   }
}

const getProfile=async(req:Request,res:Response):Promise<any>=>{
       try{
        const token=req.headers?.authorization?.split(' ')[1]||''
             const id:any=verifyToken(token)
             const user=await userModel.findById(id.id)
             return res.status(FOUND).json({data:user})
       }catch(error){
           return res.status(SERVER_ERROR).json({message:"Server error"})
       }
}


const updateProfile=async(req:Request,res:Response):Promise<any>=>{
    const data=req.body
    const token=req.headers?.authorization?.split(' ')[1]||''
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
               const isExist=await userModel.findOne({email:newData.email})
               if(isExist)return res.status(FOUND).json({message:"Email Already exists"})
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