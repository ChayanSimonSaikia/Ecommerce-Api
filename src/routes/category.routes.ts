import { Router } from "express";
import {
  addCategory,
  viewCategories,
} from "../controllers/category.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";
const router = Router();

// GET
router.get("/viewCategories", viewCategories);

// POST
router.post("/addCategory", isLoggedIn, addCategory);

export default router;
