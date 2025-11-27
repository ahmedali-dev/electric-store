import connection from "../../db/connection.js";
import catch_express from "../../utils/catch_express.js";
import ErrorHandler, { UnExpectedError } from "../../utils/ErrorHandler.js";
import validation from "../../utils/validation.js";
import { z } from "zod";
import { existsCategory } from "../categories/categories.js";
import { v7 } from "uuid";

export const get = catch_express(async (req, res, next) => {
	try {
		let { s = "asc", page = 1, id, name } = req.query;
		const limit = 15;
		page = Number(page);
		let offset = (page - 1) * limit;
		const sortOrder = s.toLowerCase() === "desc" ? "DESC" : "ASC";

		let sql = `select 
						p.id,
						p.name,
						p.quantity,
						p.update_at,
						c.name as category_name 
					from products p 
					left join categories c on c.id = p.category_id`;
		let totalSql = `select 
							count(id) as total 
						from products p`;
		let totalData = [];
		const data = [];
		const conditions = [];
		if (id) {
			// check if category is found
			if (!(await existsCategory([id]))) {
				next(
					new ErrorHandler(409, {
						success: false,
						message: "category is not found",
					})
				);
				return;
			}

			conditions.push("p.category_id = ?");
			data.push(id);
			totalData.push(id);
		}

		if (name) {
			conditions.push("p.name LIKE ?");
			data.push(`%${name.trim()}%`);
			totalData.push(`%${name.trim()}%`);
		}

		if (conditions.length > 0) {
			const whereClause = " WHERE " + conditions.join(" AND ");
			sql += whereClause;
			totalSql += whereClause;
		}

		sql += ` order by p.update_at ${sortOrder} limit ? offset ?`;
		data.push(limit, offset);

		// return;

		const [[products], [[{ total }]]] = await Promise.all([
			connection.execute(sql, data),
			connection.execute(totalSql, totalData),
		]);

		const totalPages = Math.ceil(total / limit);
		return res.status(200).json({
			success: true,
			data: {
				products,
				pagination: {
					totalItems: total,
					page,
					limit,
					totalPages,
					hasNext: page < totalPages,
					hasPrev: page > 1,
				},
			},
		});
	} catch (error) {
		next(new UnExpectedError(error));
	}
});

export const getOneValidation = validation.validate(
	z.object({
		id: z.string("Invalid product ID").nonempty("Product ID is required"),
	}),
	"params"
);
export const getOne = catch_express(async (req, res, next) => {
	try {
		const { id } = req.params;
		const sql = "select name, quantity from products where id = ? limit 1";
		const [[product]] = await connection.execute(sql, [id]);
		if (!product) {
			return next(
				new ErrorHandler(404, {
					success: false,
					message: "Product not found",
				})
			);
		}

		return res.status(200).json({
			success: true,
			data: product,
		});
	} catch (error) {
		next(new UnExpectedError(error));
	}
});

export const patchValidation = validation.validate(
	z.object({
		name: z.string().min(3, "Product name must be at least 3 characters").optional(),
		quantity: z.number("Quantity must be a number").min(0, "Quantity cannot be negative").optional(),
	}),
	"body"
);
export const patch = catch_express(async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, quantity } = req.body;
		const fields = [];
		const data = [];
		if (name !== undefined) {
			fields.push("name = ?");
			data.push(name);
		}
		if (quantity !== undefined) {
			fields.push("quantity = ?");
			data.push(quantity);
		}
		if (fields.length === 0) {
			return next(
				new ErrorHandler(400, {
					success: false,
					message: "No fields to update",
				})
			);
		}

		data.push(id);
		const sql = `update products set ${fields.join(", ")}, update_at = NOW() where id = ?`;
		const [result] = await connection.execute(sql, data);
		if (result.affectedRows === 0) {
			return next(
				new ErrorHandler(404, {
					success: false,
					message: "Product not found",
				})
			);
		}

		return res.status(200).json({
			success: true,
			message: "Product updated successfully",
		});
	} catch (error) {
		next(new UnExpectedError(error));
	}
});

export const Delete = catch_express(async (req, res, next) => {
	try {
		const { id } = req.params;
		const ExistProduct = "select id from products where id = ? limit 1";
		const [[product]] = await connection.execute(ExistProduct, [id]);
		if (!product) {
			return next(
				new ErrorHandler(404, {
					success: false,
					message: "Product not found",
				})
			);
		}

		const sql = "delete from products where id = ?";
		await connection.execute(sql, [id]);
		return res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		next(new UnExpectedError(error));
	}
});

export const postValidation = validation.validate(
	z.object({
		name: z.string().min(3, "Product name must be at least 3 characters"),
		quantity: z.number("Quantity must be a number").min(0, "Quantity cannot be negative"),
		categoryId: z.string("Category ID must be a string").nonempty("Category ID is required"),
	}),
	"body"
);

export const post = catch_express(async (req, res, next) => {
	try {
		const { name, quantity, categoryId } = req.body;
		// check if category is found
		if (!(await existsCategory([categoryId]))) {
			next(
				new ErrorHandler(409, {
					success: false,
					message: "category is not found",
				})
			);
			return;
		}

		// insert product
		const id = v7();
		const sql = `insert into products 
						(id, name, quantity, category_id)
						values (?, ?, ?, ?)`;

		const [result] = await connection.execute(sql, [id, name, quantity, categoryId]);

		return res.status(201).json({
			success: true,
			message: "Product created successfully",
		});
	} catch (error) {
		next(new UnExpectedError(error));
	}
});
