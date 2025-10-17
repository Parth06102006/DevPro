import { Router } from "express";
import { generateProjects, createProject } from "../controllers/project.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();

// Generate project ideas for a session
router.post("/:sessionId/generate", auth_handler, generateProjects);

// Create a detailed project from a generated project (selectedGenProjId via query)
router.post("/:sessionId/create", auth_handler, createProject);

export default router;