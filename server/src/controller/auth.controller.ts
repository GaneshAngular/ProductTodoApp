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

const { userModel } = models;
const signIn = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
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

    return res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1000 * 24 * 7,
    }).status(OK).json({ message: "Login Success",token })
  } catch (error) {
    return res.json(SERVER_ERROR).json({ messgae: "Server error" });
  }
};

const signUp = async (req: Request, res: Response): Promise<any> => {
  const user: User = req.body;
  user.password = await createHash(user.password);
  try {
    const isExist = await userModel.findOne({ email: user.email });
    console.log(isExist);
    if (isExist) return res.status(OK).json({ message: "Email exist" });

    const newUser = await userModel.create(user);

    return res.status(CREATED).json({ message: "signUp Success" });
  } catch (error) {
    return res.json(SERVER_ERROR).json({ messgae: "Server error" });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<any> => {
  const { accessToken, refreshToken } = req.cookies;
    //    console.log(accessToken,refreshToken)
  if (!(accessToken && refreshToken))
    return res.status(UNAUTHORISE).json({ message: "Unauthorise" });

  try {
   
      const verifyRefresh: any = verifyRefreshToken(refreshToken);
      if (!verifyRefresh)
        return res
          .status(UNAUTHORISE)
          .json({ message: "Refresh token expired" });

      const user = await models.userModel.findById(verifyRefresh.id);
      if (user?.refreshToken !== refreshToken)
        return res
          .status(UNAUTHORISE)
          .json({ message: "Refresh token invalid" });


          const newAccessToken=createToken({id:verifyRefresh.id,role:verifyRefresh.role})
          console.log("TOken refreshed")
          return res.status(OK).cookie('refreshToken',refreshToken,{httpOnly:true,secure:true}).json({message:"token refreshed",token:newAccessToken})

  } catch (error:any) {
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const authController = {
  signIn,
  signUp,
  refreshToken,
};

export default authController;
