import { Router } from "express";
import { POST__register } from "../controllers/POST/auth.post.controller";
const router = Router();

/* POST Routes */
router.post("/register", POST__register);

export default router;
