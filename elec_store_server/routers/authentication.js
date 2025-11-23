import { Router } from "express";
import { login, login_input_validate } from "../controllers/authentication/login.js";
import { signup, signup_input_validate } from "../controllers/authentication/signup.js";
import { forget_input, forget, reset, reset_input } from '../controllers/authentication/reset_password.js';
import { active_input, active_user } from './../controllers/authentication/active_user.js'
import logout from "../controllers/authentication/logout.js";
import { refreshToken } from "../controllers/authentication/refreshToken.js";
import { protect } from "../utils/authController.js";
const router = Router();

router.post('/login', login_input_validate, login);
router.post('/signup', signup_input_validate, signup);
router.post('/forget_password', forget_input, forget);
router.post('/reset_password', reset_input, reset);
router.post('/active_user', active_input, active_user);
router.post('/logout', protect, logout);
router.get('/refresh', refreshToken)
export default router;