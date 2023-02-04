import { Router } from "express";
import { addProduct } from "../controllers/product.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";

const router = Router();

/* ::GET routes */
router.get("/");

/* POST routes */
router.post("/addProduct", isLoggedIn, addProduct);

export const product_router = router;
