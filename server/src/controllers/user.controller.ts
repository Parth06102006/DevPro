import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { prisma } from "../config/db_connection.js";
prisma
import jwt, { type SignCallback } from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import type {User} from "@prisma/client"

function generateToken(user : User)
{
    //@ts-ignore
    return jwt.sign(
        {id:user.id,name:user.name,email:user.email},
        process.env.JWT_SECRET_KEY! as jwt.Secret,
        {expiresIn:process.env.JWT_EXPIRY! as string}
    )
}

const signUp = asyncHandler(async (req,res)=>{
    
    const {username,email,password} = req.body;

    if([username,email,password].some(t=>t.trim()===""))
    {
        throw new ApiError(400,"Incomplete Details");
    }

    //checking existing user
    const exisitingUser = await prisma.user.findUnique({where:{email:email}});

    if(exisitingUser)
    {
        throw new ApiError(401,"User Already Exists");
    }

    let hashedPassword;
    try {
        const salt = bcryptjs.genSaltSync(10);
        hashedPassword = bcryptjs.hashSync(password,salt);
    } catch (error) {
        //@ts-ignore
        console.error(error.message);
        throw new ApiError(500,"Error Hashing Password");
    }

    // creating new user
    try {
        const newUser = await prisma.user.create({
            data:{
                name : username,
                email,
                password:hashedPassword
            }
        })

        if(!newUser)
        {
            throw new ApiError(500,"Error Creating New User");
        }

        return res.status(201).json(new ApiResponse(201,"User Created Successfully",{newUser}))
    } catch (error) {
        //@ts-ignore
        console.error(error.message);
        throw new ApiError(500,"Error Signing Up , Try Again Later");
    }
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {
        throw new ApiError(400,"Incomplete Details");
    }

    //user exists or not
    const exisitingUser = await prisma.user.findUnique({where:{email:email}});

    if(!exisitingUser)
    {
        throw new ApiError(401,"User does not exist");
    }

    if (!exisitingUser.password) {
        throw new ApiError(403, "Invalid user credentials");
    }
    
    const isPasswordValid = await bcryptjs.compare(password, exisitingUser.password);

    if(!isPasswordValid)
    {
        throw new ApiError(403,"Incorrect Password");
    }

    const token = generateToken(exisitingUser);

    const cookieOptions = {
        httpOnly: true,
        secure: (process.env.NODE_ENV === "production"),
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRY ?? 0))
    }

    return res.status(200).cookie("token", token, cookieOptions).json(new ApiResponse(200, "User Logged in Successfully"));

})

const logout = asyncHandler(async(req,res)=>{
    //@ts-ignore
    const userId = req.user;

    const options = {
        httpOnly:true,
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        secure: (process.env.NODE_ENV === "production"),
    }

    return res.status(200).clearCookie("token",options).json(new ApiResponse(200,"User Logged Out Successfully"))
})

const checkAuth = asyncHandler(async(req,res)=>{
    const existingUser = await prisma.user.findUnique(
        {
        //@ts-ignore
            where:{id : req.user},
            select:{
                id :       true,
                name :     true,
                email:     true,
                password : false
            }
        },
    )

    if(!existingUser)
    {
        throw new ApiError(400,"No User Found");
    }

    return res.status(200).json(new ApiResponse(200,"User Verified",{user:existingUser}));
})

export {signUp , login , logout , checkAuth}