import { Router } from "express";
import {
  addProduct,
  viewRecentlyAddedProducts,
  viewProductsByCategory,
  getProduct,
} from "../controllers/product.controller";

import { addToCart } from "../controllers/auth.controller";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";

const router = Router();

/* ::GET routes */
router.get("/recentProducts", viewRecentlyAddedProducts);
router.get("/category/:category", viewProductsByCategory);

/* POST routes */
router.post("/addProduct", isLoggedIn, addProduct);
router.post("/search", getProduct);
router.post("/addCart/:product_id", isLoggedIn, addToCart);

export const product_router = router;
