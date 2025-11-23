import { Router } from "express";
import {
	Delete,
	get,
	search,
	search_validation,
	id_validation,
	patch,
	post,
	post_validation,
} from "../controllers/categories/categories.js";
import { protect } from "../utils/authController.js";
const router = Router();

router.route("/").get(protect, get).post(protect, post_validation, post);
router.post("/search", protect, search_validation, search);
router.patch("/:id", protect, id_validation, post_validation, patch);
router.route("/:id").delete(protect, id_validation, Delete);

export default router;
