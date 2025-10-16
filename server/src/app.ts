import express, { type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { error_handler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL || "*"
}))

app.get('/',(req:Request,res:Response)=>{
    res.send('<h1>Hello World</h1>')
})

app.use(error_handler);

export default app;