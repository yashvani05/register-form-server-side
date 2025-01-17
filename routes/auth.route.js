import express from "express";
import { userModelTable } from "../modules/user.model.js";
import jwt from "jsonwebtoken";
import {
  customerLogin,
  loginUser,
  registerUser,
  verifyLogin,
} from "../modules/auth.controller.js";
const router = express.Router();

router.post("/register/customer", registerUser);

router.post("/register/admin", registerUser);

router.post("/login/admin", loginUser);
router.post("/login/customer", customerLogin);

router.get("/verify-email", verifyLogin);

export { router };
