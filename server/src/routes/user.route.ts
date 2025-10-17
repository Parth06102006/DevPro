import { Router } from "express";
import { signUp , login , logout , checkAuth } from "../controllers/user.controller.js";
import { auth_handler } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",auth_handler,logout);
router.post("/check",auth_handler,checkAuth);

export default router;