import {Router} from 'express';
import controllers from '../controller/controllers';


const {userController}=controllers
const userRoute=Router()

userRoute.get('/',userController.getEmployees)

userRoute.post('/',userController.addEmployee)

userRoute.get('/self',userController.getProfile)

userRoute.put('/self',userController.updateProfile)

userRoute.put('/',userController.updateEmployee)

userRoute.delete('/',userController.deleteEmployee)

export default userRoute;