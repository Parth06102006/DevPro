import { prisma } from "../config/db_connection.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import cuid from 'cuid'

const createSession = asyncHandler(async(req,res)=>{
    const sessionId = cuid();
    try {
        const newSession = await prisma.session.create({
            data:{
                sessionToken:sessionId,
                //@ts-ignore
                userId:req.user,
            }
        })
        
        if (!newSession)
        {
            throw new ApiError(500,"Error Creating new Session");
        }

        return res.status(200).json(new ApiResponse(200,"New Session Started",newSession))

    } catch (error) {
        //@ts-expect-error
        console.error(error.message);
        throw new ApiError(500,"Error Starting New Session");
    }
})

const getSession = asyncHandler(async(req,res)=>{
    const {sessionId} = req.params;

    if(!sessionId)
    {
        throw new ApiError(400,"No Session Id Found");
    }

    const exisitingSession = await prisma.session.findUnique({
        where:{
            sessionToken:sessionId,
        }
    })

    if(!exisitingSession)
    {
        throw new ApiError(404,'No Session Found');
    }

    return res.status(200).json(new ApiResponse(200,"Session Retreived Successfully",exisitingSession));
})


const deleteSession = asyncHandler(async(req,res)=>{
    const {sessionId} = req.params;

    if(!sessionId) throw new ApiError(400,"No Session Id Found");

    try {
        await prisma.session.delete({
        where:{
            sessionToken:sessionId,
            //@ts-ignore
            userId:req.user
        }
        })

        return res.status(200).json(new ApiResponse(200,'Session and associated Project Deleted Successfully'));
    } catch (error) {
        throw new ApiError(500,"Error Deleting Session")
    }
})


export {createSession,getSession,deleteSession}