import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db_connection.js";
import jwt from "jsonwebtoken";

const auth_handler = asyncHandler(async(req,res,next)=>{
    try {
        const {token} = req.cookies || req.headers['authorization']?.replace('Bearer ', '') || '';

        if(!token)
        {
            throw new ApiError(400,"No Auth Token Found");
        }


        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret);

        //find exisiting user
        let user;
        if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) {
            user = await prisma.user.findUnique({ where: { id: (decodedToken as jwt.JwtPayload).id } });
        } else {
            throw new ApiError(401, "Invalid token payload");
        }

        if(!user)
        {
            throw new ApiError(401,"No Exisiting User Found");
        }


        //@ts-ignore
        req.user = user.id;
        next();

    } catch (error) {
        //@ts-expect-error
        console.log(error.message);
        //@ts-expect-error
        throw new ApiError(403,error.message);
    }
})

export {auth_handler};