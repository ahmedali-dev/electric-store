import { Router } from "express";
import { get } from "../controllers/categories/products.js";
import { protect } from "../utils/authController.js";

const router = Router();

router.route("/").get(protect, get);

export default router;
