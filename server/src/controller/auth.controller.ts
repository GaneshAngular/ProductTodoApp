import { Request, Response } from "express";
import models from "../models/models";
import User from "../interfaces/user.interface";
import {
  CREATED,
  INVALID,
  NOT_FOUND,
  OK,
  SERVER_ERROR,
  UNAUTHORISE,
} from "../constants/statusCode";
import { compareHash, createHash } from "../services/bcrypt.service";
import {
  createRefreshToken,
  createToken,
  verifyRefreshToken,
  verifyToken,
} from "../services/jwt.service";
import { isConstructorDeclaration } from "typescript";
import { cookieOption } from "../constants/constants";

const { userModel } = models;
const signIn = async (req: Request, res: Response): Promise<any> => {

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(NOT_FOUND).json({ message: "No Account Exist" });
    const isVerified = await compareHash(password, user.password);

    if (!isVerified)
      return res.status(INVALID).json({ message: "Invalid Login" });

    const token = createToken({ id: user._id, role: user.role });
    const refreshToken = createRefreshToken({ id: user._id, role: user.role });
    if (!token && !refreshToken)
      return res.status(SERVER_ERROR).json({ message: "Server Error" });
    user.refreshToken = refreshToken;
    await user.save();

    return res.cookie("refreshToken", refreshToken,cookieOption
    ).status(OK).json({ message: "Login Success",token })
  } catch (error) {
    return res.json(SERVER_ERROR).json({ messgae: "Server error" });
  }
};

const signUp = async (req: Request, res: Response): Promise<any> => {
  const user: User = req.body;
  user.password = await createHash(user.password);
  try {
    const isExist = await userModel.findOne({ email: user.email });
   
    if (isExist) return res.status(OK).json({ message: "Email exist" });

    const newUser = await userModel.create(user);

    return res.status(CREATED).json({ message: "signUp Success" });
  } catch (error) {
    return res.json(SERVER_ERROR).json({ messgae: "Server error" });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!(refreshToken))
    return res.status(SERVER_ERROR).json({ message: "Invalid Access" });

  try {
   
      const verifyRefresh: any = verifyRefreshToken(refreshToken);

      if (!verifyRefresh)
        return res
          .status(SERVER_ERROR)
          .json({ message: "Refresh token expired" });

      const user = await models.userModel.findById(verifyRefresh.id);
      if (user?.refreshToken !== refreshToken)
        return res
          .status(SERVER_ERROR)
          .json({ message: "Refresh token invalid" });


          const newAccessToken=createToken({id:verifyRefresh.id,role:verifyRefresh.role})
      
          return res.status(OK).json({message:"token refreshed",token:newAccessToken})

  } catch (error:any) {
    
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const logOut=async(req:Request, res:Response):Promise<any> => {
         try{
          const accessToken=req.headers?.authorization?.split(' ')[1]
          if(!accessToken)return res.status(UNAUTHORISE).json({message:"Unauthorise"}) 
              
              const verify:any=verifyToken(accessToken)
        
               const user:any=await userModel.findById(verify.id)
               user.refreshToken=''
               await user.save()
           return res.status(OK).json({ message:"Logout success"})
         }catch(error){
          return res.status(SERVER_ERROR).json({message:"Server error"})
         }
}

const authController = {
  signIn,
  signUp,
  refreshToken,
  logOut
};

export default authController;
