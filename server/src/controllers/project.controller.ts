import { prisma } from "../config/db_connection.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import openai from "../config/openai.js";

const generateProjects = asyncHandler(async(req,res)=>{
    const { programmingLanguage, techStack, title , description , difficulty } = req.body;
    const {sessionId} = req.params;
    if(!sessionId)
    {
        throw new ApiError(400,'No Session Id Found')
    }

    if(!programmingLanguage || !techStack || !title)
    {
        throw new ApiError(400,"Kindly Enter Languages or Tech Stack");
    }

    try {
        const exisitingSession = await prisma.session.findUnique({
            where:{
                sessionToken:sessionId,
                //@ts-ignore
                userId:req.user,
            }
        })
        
        if (!exisitingSession)
        {
            throw new ApiError(500,"No Session Exists");
        }

        try {
            await prisma.session.update({
                where:{
                    id:exisitingSession.id
                },
                data:{
                    inputLanguage:programmingLanguage,
                    inputTechStack:techStack
                }
            })
        } catch (error) {
            //@ts-ignore
            console.error(error.message);
            throw new ApiError(500,"Error Updating Session")
        }

        const system_prompt = `
        You are an AI assistant that helps generate structured software project ideas based on a given session context.

        You must respond with a **single, valid JSON array** containing **multiple project objects**. Each object must exactly match this schema:

        {
        "title": string,                   // name of the project
        "description": string,             // clear summary of what the project does
        "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED", // level of complexity
        "programmingLanguage": string[],     // e.g. "Python", "JavaScript", "C++"
        "techStack": string[]              // list of main technologies, e.g. ["React", "Node.js", "MongoDB"]
        }

        Rules:
        - Return a **valid JSON array** of **at least 5 project objects**.
        - Only return JSON (no markdown, no extra text).
        - The output must follow the schema above exactly.
        - If difficulty is not mentioned, use "BEGINNER".
        - Always ensure "techStack" is an array of strings.
        - Do NOT include null values or empty strings.
        - Do NOT include any extra keys.
        `;

        const user_prompt = `
        Session metadata:
        - Title: ${title ?? "Untitled"}
        - Description: ${description ?? "No description provided."}
        - Difficulty: ${difficulty ?? "BEGINNER"}
        - Programming Language: ${Array.isArray(programmingLanguage) ? programmingLanguage.join(", ") : programmingLanguage}
        - Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}

        Task:
        Generate **5-10 project ideas** that fit the session context above.
        Return only a JSON array of objects with the exact keys: title, description, difficulty, programmingLanguage, techStack.
        `;


        const messages = [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt }
        ]

        const response = await openai.chat.completions.create(
            {
                model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
                messages: messages as any,
                response_format: {
                    "type": "json_object"
                }
            }
        )

        const generatedProjectList = JSON.parse(((response.choices[0]?.message?.content) as unknown) as string);

        if(generatedProjectList?.length === 0)
        {
            throw new ApiError(500,"Error Generating Projects");
        }

        for (let i = 0 ; i < generatedProjectList.projects.length ; i++)
        {
            if(generatedProjectList.projects[i])
            {
                const newItem = generatedProjectList.projects[i];
                try {
                    await prisma.generatedProject.create(
                    {
                        data:{
                            sessionId : exisitingSession.id,
                            title : newItem.title,
                            description:newItem.description,
                            difficulty:newItem.difficulty,
                            techStack:newItem.techStack,
                            programmingLanguage : newItem.programmingLanguage
                         }
                    })
                } catch (error) {
                    //@ts-expect-error
                    console.error(error.message);
                    throw new ApiError(500,"Error Creating Generated Projects")
                }
            }
        }

        const generatedProjectIdeas = await prisma.generatedProject.findMany({where:{
            sessionId:exisitingSession.id
        }})

        return res.status(200).json(new ApiResponse(200,"Project Ideas Generated Successfully",generatedProjectIdeas))

    } catch (error) {
        //@ts-expect-error
        console.error(error.message);
        throw new ApiError(500,"Error Generating Projects");
    }
})

const createProject = asyncHandler(async(req,res)=>{
    const {selectedGenProjId} = req.query;
    const {sessionId} = req.params;

    if(!sessionId)
    {
        throw new ApiError(400,"No Session Id Found");
    }

    if(!selectedGenProjId)
    {
        throw new ApiError(400,"No Generated Project Selected");
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
            id:(selectedGenProjId as string),
        }
    })

    if(!generatedProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    }

    const system_prompt = `You are an AI assistant whose job is to take a high-level project description (from a "GeneratedProject") and produce a fully detailed Project in JSON format. 

        The JSON must strictly include:

        - title (string): the project title
        - description (string): a more in-depth explanation of the project
        - difficulty (BEGINNER | INTERMEDIATE | ADVANCED)
        - programmingLanguage (array of strings): all relevant programming languages
        - techStack (array of strings): all relevant technologies
        - implementationSteps (array of objects): each object should contain:
            - stepNumber (integer): order of the step
            - title (string): brief step title
            - details (string): detailed explanation of the step

        Return only valid JSON. Do not include explanations, commentary, or markdown. Make sure the JSON is valid and parseable.
        `;

        const user_prompt = `
        Here is a GeneratedProject:
        {
            title: ${generatedProject.title};
            description: ${generatedProject.description};
            difficulty: ${generatedProject.difficulty};
            techStack: ${generatedProject.techStack};
            programmingLanguage: ${generatedProject.programmingLanguage};
        }

        Generate a fully detailed Project JSON object including all the fields mentioned in the system prompt. The implementationSteps should break the project into actionable steps for a developer to follow.
        `;


        const messages = [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt }
        ]

        const response = await openai.chat.completions.create(
            {
                model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
                messages: messages as any,
                response_format: {
                    "type": "json_object"
                }
            }
        )

    const generatedResponse = JSON.parse(((response.choices[0]?.message?.content) as unknown) as string);

    console.log(generatedResponse);

    const newProject = await prisma.project.create({
        data:{
            title:generatedResponse.title,
            description:generatedResponse.description, 
            difficulty:generatedResponse.difficulty,
            techStack:generatedResponse.techStack,
            programmingLanguage:generatedResponse.programmingLanguage,
            //@ts-ignore           
            createdById:req.user,
            generatedFromId:generatedProject.id
        }
    })

    if(!newProject)
    {
        throw new ApiError(500,"Error Creating New Project");
    }

    const createdSteps = await Promise.all(
        generatedResponse.implementationSteps.map((step: any) => 
            prisma.step.create({
                data:{
                    stepNumber: step.stepNumber,
                    title: step.title,
                    details: step.details,
                    projectId: newProject.id 
                }
            })
        )
    );

    const projectWithSteps = await prisma.project.findUnique({
        where:{id:newProject.id},
        include:{implementationSteps:true}
    })


    return res.status(200).json(new ApiResponse(200,"Detailed Structure of Project Created",projectWithSteps));
})

const saveProject = asyncHandler(async(req,res)=>{
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


    const project_saved = await prisma.savedProject.create({
        data:{
            //@ts-ignore
            userId:req.user,
            projectId:existingProject.id
        }
    })

    return res.status(200).json(new ApiResponse(200,"Project Saved Successfully",project_saved))
})

const getProjectInfo = asyncHandler(async(req,res)=>{
    const {selectedGenProjId} = req.query;
    const {sessionId} = req.params;

    if(!sessionId)
    {
        throw new ApiError(400,"No Session Id Found");
    }

    if(!selectedGenProjId)
    {
        throw new ApiError(400,"No Generated Project Selected");
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
            id:(selectedGenProjId as string),
        }
    })

    if(!generatedProject)
    {
        throw new ApiError(400,"No Exisiting Project Found");
    }

    const projectWithSteps = await prisma.project.findUnique({
        where:{generatedFromId:generatedProject.id},
        include:{implementationSteps:true}
    })


    return res.status(200).json(new ApiResponse(200,"Detailed Structure of Project Fetched",projectWithSteps));
})

const getGeneratedProjectList = asyncHandler(async(req,res)=>{
    const {sessionId} = req.params;
    if(!sessionId)
    {
        throw new ApiError(400,'No Session Id Found')
    }

    let exisitingSession;
    try {
        exisitingSession = await prisma.session.findUnique({
            where:{
                sessionToken:sessionId,
                //@ts-ignore
                userId:req.user,
            }
        })
        
        if (!exisitingSession)
        {
            throw new ApiError(500,"No Session Exists");
        }

    } catch (error) {
        //@ts-ignore
        console.error(error.message);
        throw new ApiError(500,"Error Fetcing Session")
    }

    const generatedProjectIdeas = await prisma.generatedProject.findMany({
        where:{
            sessionId:exisitingSession.id
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    console.log(generatedProjectIdeas);

    return res.status(200).json(new ApiResponse(200,"Fetched Generated Project List",generatedProjectIdeas))
})

const getUserProjectProfileInfo = asyncHandler(async(req,res)=>{
    try {
        //@ts-ignore
        const user = req.user; 
        const totalProjects = await prisma.project.count({
            where:{
                createdById:user
            }
        })

        const beginnerProject = await prisma.project.count({
            where:{
                createdById:user,
                difficulty:'BEGINNER'
            }
        })

        const intermediateProject = await prisma.project.count({
            where:{
                createdById:user,
                difficulty:'INTERMEDIATE'
            }
        })

        const advancedProject = await prisma.project.count({
            where:{
                createdById:user,
                difficulty:'ADVANCED'
            }
        })

        const recentSessions = await prisma.session.findMany({
            take:5,
            orderBy: {
                createdAt: 'desc',
            },
            where:{
                userId:user,
            }
        })

        const topProjects = await prisma.project.findMany({
            take: 5,
            include: {
            _count: {
                select: {
                implementationSteps:true,
                savedByUsers: true,
                recommendationByAI: true,
                },
            },
            },
            orderBy: {
            savedByUsers: { _count: "desc" },
            },
        });

        const sessionCounts = await prisma.session.groupBy({
            by: ['createdAt'],
            _count: { _all: true },
            orderBy: { createdAt: 'asc' }
        })

        const projectCount = await prisma.project.groupBy({
            by: ['createdAt'],
            _count: { _all: true },
            orderBy: { createdAt: 'asc' }
        })

        const projectGroupedByDate = projectCount.reduce((acc, item) => {
            const date = new Date(item.createdAt).toISOString().split('T')[0] // remove time
            const count = item._count._all

            //@ts-ignore
            if (!acc[date]) acc[date] = 0
            //@ts-ignore
            acc[date] += count

            return acc
        }, {})

        const projectCountList = Object.entries(projectGroupedByDate).map(([date, count]) => ({
        date,
        count
        }))

        const sessionsGroupedByDate = sessionCounts.reduce((acc, item) => {
            const date = new Date(item.createdAt).toISOString().split('T')[0] // remove time
            const count = item._count._all

            //@ts-ignore
            if (!acc[date]) acc[date] = 0
            //@ts-ignore
            acc[date] += count

            return acc
        }, {})

        const sessionCountList = Object.entries(sessionsGroupedByDate).map(([date, count]) => ({
            date,
            count
        }))

        const data = {totalProjects,beginnerProject,intermediateProject,advancedProject,recentSessions,topProjects,sessionCountList,projectCountList}

        return res.status(200).json(new ApiResponse(200,"Details Fetched Successfully",data))
    } catch (error) {
        if(error instanceof Error) console.error(error.message)
        throw new ApiError(500,"Details Cannnot be Fetched")
    }

})

export {generateProjects,createProject,saveProject,getProjectInfo,getGeneratedProjectList,getUserProjectProfileInfo}