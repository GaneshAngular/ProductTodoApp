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
      console.log(query);
    // Default values for pagination, page 1 and 10 items per page
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
  
    // Calculate the number of items to skip based on the page number
    const skip = (page - 1) * limit;
  
    // Default sorting by name, if no query parameter provided
    const sortBy = query.sortBy || 'department'; // You can specify any field for sorting
    // Default sort order is ascending
  
    // Regex search pattern for name (if a search string is provided)
    const searchPattern = query.search || '';
    const nameRegex = new RegExp(`^${searchPattern}`, 'i'); // case-insensitive regex search
  
    // Construct the query
    const filter = { role: EMPLOYEE, name: { $regex: nameRegex } };
  
    // Find employees with pagination, sorting, and filtering
    const employees = await userModel.find(filter)
      .skip(skip)          // Skip items for pagination
      .limit(limit)        // Limit the number of results per page
      .sort({ [sortBy]: 1 });  // Sort by the specified field (ascending or descending)
  
    // Check if any employees were found
   
    const totalRecords = await userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);
  
    // Send the response with the employees data
    return res.status(OK).json({ data: employees,limit,totalPages });
  
  } catch (error) {
    console.error(error); // Log the error for debugging
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