import openai from "../config/openai.js";
import { prisma } from "../config/db_connection.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateSuggestions = asyncHandler(async(req,res)=>{
    const {projectId} = req.query;
    const {sessionId} = req.params;

    if(!sessionId)
    {
        throw new ApiError(400,"No Session Id Found");
    }

    if(!projectId)
    {
        throw new ApiError(400,"No Project Id Found");
    }

    const existingSession = await prisma.session.findUnique({
        where:{
            sessionToken : sessionId,
            //@ts-ignore
            userId:req.user
        }
    })

    if(!existingSession)
    {
        throw new ApiError(400,"No Existing Session Found");
    }

    const existingProject = await prisma.project.findUnique({
        where:{
            id:(projectId as string),
        }
    })

    if(!existingProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    } 

    //to be continued later add recommendation and more ...

})