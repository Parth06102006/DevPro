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

    const generatedProject = await prisma.generatedProject.findUnique({
        where:{
            id:(projectId as string),
        }
    })

    if(!generatedProject)
    {
        throw new ApiError(400,"No Exisiting Generated Project Found");
    } 

    const existingProject = await prisma.project.findUnique({
        where:{
            generatedFromId:generatedProject.id
        }
    })

    if(!existingProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    } 


    const system_prompt = `You are an AI assistant that provides additional recommendations for a software project.
    You will receive a JSON object describing a project from the DevPro platform, including fields such as:
    {
    "title": string,
    "description": string,
    "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    "programmingLanguage": string[],
    "techStack": string[]
    }

    Your task is to analyze the project and generate a list of **AI-powered recommendations** to improve it.  
    Each recommendation should be specific, actionable, and helpful for a developer implementing this project.

    Return the output strictly as a **valid JSON array** of recommendation objects in the following schema:

    {
        "details": string,      // Clear, concise suggestion for improvement
    }

    Rules:
    - Return only a valid JSON object, no markdown or explanations.
    - Each “details” field must be unique and specific.
    -Include a 1 good recommendation
    - Do NOT include null or empty strings.
    `;

    const user_prompt = `Here is the project for which you need to generate AI recommendations:
    Title: ${existingProject.title}
    Description: ${existingProject.description}
    Difficulty: ${existingProject.difficulty}
    Programming Languages: ${existingProject.programmingLanguage.join(", ")}
    Tech Stack: ${existingProject.techStack.join(", ")}

    Task:
    Generate single recommendations that can help improve or extend this project.
    Each recommendation must focus on practical development advice, optimization, feature expansion, or user experience improvements.

    Return only a valid JSON object following the schema in the system prompt.
    `

    const messages = [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt }
    ]

    const response = await openai.chat.completions.create({
        model:"deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages:messages as any,
        response_format: {
            "type": "json_object"
        }
    })

    const generatedResponse = JSON.parse(((response.choices[0]?.message?.content) as unknown) as string);

    if(!generatedResponse)
    {
        throw new ApiError(500,"Error Generating Suggestions");
    }

    console.log(generatedResponse)

    const aiSuggestions = await prisma.recommendation.create({
        data:{
            details:generatedResponse.details,
            projectId:existingProject.id
        }
    })

    return res.status(200).json(new ApiResponse(200,"Suggestions Generated Successfully",aiSuggestions));

})  

const generateAnswer = asyncHandler(async(req,res)=>{
    const {question} = req.body;
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

    if(!question)
    {
        throw new ApiError(400,"No Question Found");
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

    const generatedProject = await prisma.generatedProject.findUnique({
        where:{
            id:(projectId as string),
        }
    })

    if(!generatedProject)
    {
        throw new ApiError(400,"No Exisiting Generated Project Found");
    } 

    const existingProject = await prisma.project.findUnique({
        where:{
            generatedFromId:generatedProject.id
        }
    })

    if(!existingProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    } 

    const system_prompt = `You are an AI development assistant integrated into the DevPro platform.

        Your task is to answer a user's technical question related to a specific programming project.
        You will receive information about the project (its title, description, difficulty, languages, and tech stack),
        along with a user question.

        Your response must be in **valid JSON format** following this schema:

        {
        "question": string, // repeat the user's question
        "answer": string    // provide a detailed, accurate, and context-aware answer
        }

        Rules:
        - Return ONLY valid JSON (no markdown, no commentary).
        - The answer should be practical and relevant to the project’s tech stack.
        - If unsure, provide best practices or logical next steps.
        - Avoid nulls or empty strings.
    `;

    const user_prompt = `Project Information:
        Title: ${existingProject.title}
        Description: ${existingProject.description}
        Difficulty: ${existingProject.difficulty}
        Programming Languages: ${existingProject.programmingLanguage.join(", ")}
        Tech Stack: ${existingProject.techStack.join(", ")}

        User Question:
        "${question}"

        Now provide a structured JSON response following this format:
        {
        "question": string,
        "answer": string
        }
    `;

    const messages = [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt }
    ]

    const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    messages: messages as any,
    response_format: { type: "json_object" }
    });

    const generatedResponse = JSON.parse(((response.choices[0]?.message.content)as unknown)as string);

    console.log('Answer for the Question : \n',generatedResponse);

    if(!generatedResponse) throw new ApiError(500,"Error Generating Answer");

    let answer;
    try {
        answer = await prisma.projectAnswer.create({
        data:{
            question:question,
            answer:generatedResponse.answer,
            projectId : existingProject.id
        }
        })
    } catch (error) {
        throw new ApiError(500,"Error Creating Answer")
    }

    return res.status(200).json(new ApiResponse(200,"Generated Answer Successfully",answer));
})

const getMessages = asyncHandler(async(req,res)=>{
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

    const generatedProject = await prisma.generatedProject.findUnique({
        where:{
            id:(projectId as string),
        }
    })

    if(!generatedProject)
    {
        throw new ApiError(400,"No Exisiting Generated Project Found");
    } 

    const existingProject = await prisma.project.findUnique({
        where:{
            generatedFromId:generatedProject.id
        }
    })

    if(!existingProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    } 

    let chat;
    try {
        chat = await prisma.projectAnswer.findMany({
        where:{
            projectId : existingProject.id
        }
        })
    } catch (error) {
        throw new ApiError(500,"Error Fetching Chats")
    }

    return res.status(200).json(new ApiResponse(200,"Generated Answer Successfully",chat));
})

export {generateSuggestions,generateAnswer,getMessages}