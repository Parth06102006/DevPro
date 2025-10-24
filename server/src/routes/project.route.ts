import { Router } from "express";
import { generateProjects, createProject ,saveProject , getProjectInfo, getGeneratedProjectList,getUserProjectProfileInfo } from "../controllers/project.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/dashboard',auth_handler,getUserProjectProfileInfo)
// Generate project ideas for a session
router.post("/:sessionId/generate", auth_handler, generateProjects);

// Create a detailed project from a generated project (selectedGenProjId via query)
router.post("/:sessionId/create", auth_handler, createProject);
router.post("/:sessionId/save", auth_handler, saveProject);
router.get("/:sessionId/info", auth_handler, getProjectInfo);
router.get("/:sessionId/list", auth_handler, getGeneratedProjectList);


export default router;