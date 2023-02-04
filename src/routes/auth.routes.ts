import { Router } from "express";
import {
  POST__login,
  PUT__refreshToken,
  POST__register,
} from "../controllers/auth.controller";
const router = Router();

/* POST Routes */
router.post("/register", POST__register);
router.post("/login", POST__login);

/* PUT Routes */
router.put("/refreshToken", PUT__refreshToken);

export default router;
