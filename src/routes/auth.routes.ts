import { Router } from "express";
import {
  GET__verifyEmail,
  POST__login,
  PUT__refreshToken,
  POST__register,
  POST__sendVerificationEmail,
  POST_forgotPassword,
  PATCH_resetPassword,
} from "../controllers/auth.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";
const router = Router();

/* GET Routes */
router.get("/verify/:token", GET__verifyEmail);

/* POST Routes */
router.post("/register", POST__register);
router.post("/login", POST__login);
router.post("/sendVerifyEmail", isLoggedIn, POST__sendVerificationEmail);
router.post("/forgotPassword", POST_forgotPassword);

/* PUT Routes */
router.put("/refreshToken", PUT__refreshToken);

/* PATCH Routes */
router.patch("/resetPassword/:userid/:token", PATCH_resetPassword);

export default router;
