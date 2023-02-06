import { Router } from "express";
import {
  addProduct,
  viewRecentlyAddedProducts,
  viewProductsByCategory,
} from "../controllers/product.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";

const router = Router();

/* ::GET routes */
router.get("/recentProducts", viewRecentlyAddedProducts);
router.get("/category/:category", viewProductsByCategory);

/* POST routes */
router.post("/addProduct", isLoggedIn, addProduct);

export const product_router = router;
