import openai from "../config/openai.js";
import { prisma } from "../config/db_connection.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateResponse = asyncHandler(async(req,res)=>{
    const {question} = req.body;

    if(!question.trim()) throw new ApiError(400,"No Question Received")

    try {
            const user_info = await prisma.user.findUnique({
        where:{
            //@ts-ignore
            id:req.user
        },
        select:{
            id:false,
            name:true,
            email:false,
            createdAt:false,
            updatedAt:false,
            sessions:{
                select:{
                    id:true,
                    userId:false,
                    sessionToken:false,
                    inputLanguage:true,
                    inputTechStack:true,
                    createdAt:true,
                    updatedAt:true,
                    generatedProjects:true
                }
            },
            createdProjects:{
                select:{
                    id:false,
                    title:true,
                    description:true,
                    difficulty:true,
                    techStack:true,
                    programmingLanguage:true,
                    implementationSteps:true,
                    createdById:false,
                    createdAt:true,
                    updatedAt:true,
                    recommendationByAI:true,
                    projectAnswers:true
                }
            },
            savedProjects:true
        }
    })

    if(!user_info) throw new ApiError(404,"User Data Not Found");


        const system_prompt = `You are a helpful AI assistant for DevPro, an intelligent web application that helps developers escape "Tutorial Hell" by providing personalized project recommendations with detailed implementation steps.

        About DevPro Platform:
        DevPro is designed to solve a critical problem: many aspiring developers get stuck in "Tutorial Hell" - endlessly watching tutorials without building real projects. DevPro uses AI (powered by DeepSeek) to generate tailored project ideas based on users' chosen programming languages or tech stacks, complete with:
        - Difficulty-based project filtering (BEGINNER, INTERMEDIATE, ADVANCED)
        - Step-by-step implementation guidance
        - Multi-stack support
        - Project tracking and management
        - AI-powered Q&A for each project

        Current User Context:
        - User Name: ${user_info?.name}
        - Total Sessions: ${user_info?.sessions.length}
        - Projects Created: ${user_info?.createdProjects.length}
        - Saved Projects: ${user_info?.savedProjects.length}

        User's Recent Activity:
        ${user_info?.sessions.length > 0 
        ? `- Latest session used: ${user_info?.sessions[0]?.inputLanguage || 'N/A'} (${user_info?.sessions[0]?.inputTechStack || 'N/A'})`
        : '- No sessions yet'}
        ${user_info?.createdProjects.length > 0
        ? `- Recent projects: ${user_info?.createdProjects.slice(0, 3).map(p => p.title).join(', ')}`
        : '- No projects created yet'}

        Your Role:
        Also Only Answer to the Question in a apt format and lines and short to make the question clear and understandable and if the question is related to any of the following sub-topics or sub-headers answer only the chosen headers for the question asked by client :
        1. Help users understand how to use the DevPro platform
        2. Answer questions about features, navigation, and functionality
        3. Explain how to create, save, and manage projects
        4. Guide users on how to get the most out of the AI recommendations
        5. Provide information about project difficulty levels and tech stacks
        6. Help users understand their dashboard, sessions, and project history
        7. Encourage users to actively build projects rather than just consuming tutorials
        8. Assist with account-related questions and platform navigation

        Guidelines:
        - Be friendly, supportive, and encouraging
        - Focus on platform functionality and user guidance
        - Do NOT provide specific coding help or project implementation details (that's handled by project-specific Q&A)
        - Direct users to the appropriate features when needed
        - Emphasize the platform's mission: breaking free from Tutorial Hell through hands-on building
        - Keep responses concise and action-oriented
        - If asked about technical implementation of projects, suggest using the project-specific Q&A feature
        - Personalize responses based on user's activity level (new user vs. active user)`;

        const user_prompt = `User Question: ${question}

        Please provide a helpful answer about the DevPro platform, its features, or how to use it effectively.`;

        
        const messages = [
            { role: "system", content: system_prompt },
            { role: "user", content: user_prompt }
        ]

        const result = await openai.chat.completions.create({
            model:"deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages:messages as any,
        })

        const response = result.choices[0]?.message

        return res.status(200).json(new ApiResponse(200,"Generated Response for the User",response))
    } catch (error) {
        throw new ApiError(500,"Cannot Generate Response")
    }

})

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

export {generateSuggestions,generateResponse,generateAnswer,getMessages}