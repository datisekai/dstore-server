import express from "express";
import { getUser, login } from "../controller/AuthController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/login", login);

router.get("/user", isLogin, getUser);

export default router;
