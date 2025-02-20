import express from "express";
import routes from "./routes/routes";
import connecteDatabase from "./services/mongoose.service";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { verifyAccessToken } from "./middleware/auth.middlware";
const {userRoute,authRoute}=routes

const app= express();

 connecteDatabase()
 app.use(cookieParser())
 app.use(cors({credentials:true,origin: 'http://localhost:4200'}))
app.use(express.json());

app.use('/auth',authRoute)
app.use('/user',userRoute);


app.listen(3000,()=>{
    console.log('Server is running on port 3000'); 
})