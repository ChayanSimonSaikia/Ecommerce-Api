import { NextFunction, Request, Response, Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware";
const router = Router();

/* ::GET routes */
router.get(
  "/",
  isLoggedIn,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("You are logged in");
  }
);

export const product_router = router;
