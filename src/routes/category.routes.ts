import { Router } from "express";
import { POST__category } from "../controllers/category.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";
const router = Router();

// POST
router.post("/addCategory", isLoggedIn, POST__category);

// GET
router.get("/addCategory", isLoggedIn, POST__category);

export default router;
