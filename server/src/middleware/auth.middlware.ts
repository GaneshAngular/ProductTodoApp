import { NextFunction, Request, Response } from "express";
import { UNAUTHORISE } from "../constants/statusCode";
import { verifyRefreshToken, verifyToken } from "../services/jwt.service";
import models from "../models/models";


const verifyAccessToken=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
                   try {
                    const accessToken=req.headers?.authorization?.split(' ')[1]
                    if(!accessToken)return res.status(UNAUTHORISE).json({message:"Unauthorise"}) 
                        
                        const verify=verifyToken(accessToken)
                       if(!verify)return res.status(UNAUTHORISE).json({message:"Unauthorise"}) 

                      next()  
                   } catch (error) {
                    return res.status(UNAUTHORISE).json({message:"Unauthorise"}) 
                   }     
}

export{
    verifyAccessToken
}