import { Router } from "express";
import { createSession, getSession , getSessionList, deleteSession } from "../controllers/session.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create",auth_handler,createSession);
router.get("/:sessionId/retrive",auth_handler,getSession);
router.get("/list",auth_handler,getSessionList);
router.delete("/:sessionId/delete",auth_handler,deleteSession);

export default router;