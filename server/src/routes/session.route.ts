import { Router } from "express";
import { createSession, getSession } from "../controllers/session.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create",auth_handler,createSession);
router.get("/retrive",auth_handler,getSession);

export default router;