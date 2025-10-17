import express, { type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import { error_handler } from './middlewares/error.middleware.js';
import userControllers from './routes/user.route.js'

dotenv.config();

const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL || "*"
}));
app.use(express.json());
app.use(cookieParser());

app.get('/',(req:Request,res:Response)=>{
    res.send('<h1>Hello World</h1>')
})

app.use("/users",userControllers)

app.use(error_handler);

export default app;