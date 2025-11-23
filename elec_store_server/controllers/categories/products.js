import connection from "../../db/connection.js";
import catch_express from "../../utils/catch_express.js";
import ErrorHandler, { UnExpectedError } from "../../utils/ErrorHandler.js";
import validation from "../../utils/validation.js";
import { z } from "zod";
import { existsCategory } from "./categories.js";

export const get = catch_express(async (req, res, next) => {
	try {
		let { page = 1, id } = req.query;
		const limit = 15;
		page = Number(page);
		let offset = (page - 1) * limit;
		let sql =
			"select p.id, p.name, p.quantity,p.update_at,c.name as category_name from products p right join categories c on c.id = p.category_id where limit ? offset ?";
		let data = [limit, offset];
		let totalSql = "select count(id) as total from products ";
		let totalData = [];
		if (id) {
			console.log("from category search", !!id);
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

			sql = sql.replace("where", "where p.category_id = ?");
			totalSql = totalSql.concat(" where category_id = ?");
			totalData.push(id);
			data.unshift(id);
		} else {
			sql = sql.replace("where", "");
		}

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
