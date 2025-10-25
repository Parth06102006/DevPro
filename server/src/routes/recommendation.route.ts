import { Router } from "express";
import { generateSuggestions,generateAnswer, getMessages, generateResponse } from "../controllers/recommendation.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/response",auth_handler,generateResponse)
router.post("/:sessionId/create",auth_handler,generateSuggestions);
router.post("/:sessionId/chat",auth_handler,generateAnswer);
router.get("/:sessionId/retrieveMessages",auth_handler,getMessages);

export default router;