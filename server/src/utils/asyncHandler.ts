import { type Request,type Response,type NextFunction } from "express";

type requestHandlerProps = (req:Request,res:Response,next:NextFunction)=> Promise<any>;

const asyncHandler = (requestHandler:requestHandlerProps)=>{
    return((req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch(next);
    })
}

export default asyncHandler;