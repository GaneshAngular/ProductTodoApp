

import { Router } from "express";
import controllers from '../controller/controllers';
const {authController}=controllers
const authRoute=Router()

authRoute.post('/signin',authController.signIn)

authRoute.post('/signup',authController.signUp)

authRoute.post('/refresh',authController.refreshToken)

export default authRoute