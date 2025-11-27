import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import connection from "./db/connection.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import ErrorHandler from "./utils/ErrorHandler.js";
import { createWriteStream } from "fs";
import jwt from "jsonwebtoken";

import path from "path";
const app = express();
const _PORT = process.env.PORT || 3000;

let accessLogStream = createWriteStream(path.join(path.dirname("."), "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
	req.reqTime = new Date().toISOString();
	next();
});

// ------------------
// authentication
// ------------------
import authentication from "./routers/authentication.js";
app.use("/api/v1/auth", authentication);

// ------------------
// categories
// ------------------
import categories from "./routers/categories.js";
app.use("/api/v1/categories", categories);

// ------------------
// products
// ------------------

import products from "./routers/products.js";
app.use("/api/v1/products", products);

// ------------------
// order
// ------------------
import order from "./routers/orders.js";
app.use("/api/v1/orders", order);

// ------------------

app.use((err, req, res, next) => {
	if (err instanceof jwt.JsonWebTokenError) {
		res.status(401).json({
			success: false,
			message: "Invalid login, Please login again",
		});
	}

	if (err instanceof jwt.TokenExpiredError) {
		res.status(401).json({
			success: false,
			message: "Token expire, Please login again",
		});
	}

	if (err instanceof SyntaxError || err instanceof TypeError) {
		res.status(400).json({
			success: false,
			message: "Unexpected Error",
		});
	}

	if (err instanceof ErrorHandler) {
		console.log(err.stack);
		const data = err.stack ? { ...err.response, stack: String(err.stack) } : err.response;
		res.status(Number(err.status)).json(data);
	}
});
connection
	.getConnection()
	.then(() => {
		app.listen(_PORT, () => {
			console.log("hello world http://localhost:" + _PORT);
		});
	})
	.catch((err) => {
		console.log(err);
	});

// middleware
