import ApiError from "../utils/ApiError.js";
import {type Request,type Response,type NextFunction } from "express";

const error_handler = function(err : any,req : Request,res : Response,next : NextFunction){
    let error = err;
    if(!(error instanceof ApiError)){

        let statusCode = error?.statusCode || 500;
        let message = error.message || "Something went Wrong";
        error = new ApiError(statusCode,message,error?.error || []);

        if(process.env.NODE_ENV === "development") 
        {
            error.stack = error.stack;
        }
    }

    return res.status(error.statusCode).json(error)
}

export {error_handler};