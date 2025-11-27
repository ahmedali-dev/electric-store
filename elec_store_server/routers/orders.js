import express from "express";
import Orders from "../controllers/orders/orders.js";
import { protect } from "../utils/authController.js";
const router = express.Router();
const order = new Orders();

router.route("/").get(protect, order.get);

export default router;
