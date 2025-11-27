import { Router } from "express";
import {
	get,
	getOne,
	getOneValidation,
	patchValidation,
	patch,
	Delete,
	postValidation,
	post,
} from "../controllers/products/products.js";
import { protect } from "../utils/authController.js";

const router = Router();

router.route("/").get(protect, get).post(protect).post(protect, postValidation, post);
router
	.route("/:id")
	.get(protect, getOneValidation, getOne)
	.patch(protect, getOneValidation, patchValidation, patch)
	.delete(protect, getOneValidation, Delete);

export default router;
