import connection from "../../db/connection.js";
import { UnExpectedError } from "../../utils/ErrorHandler.js";
import catch_express from "../../utils/catch_express.js";

class Orders {
	#sql = "select * from orders";
	get = catch_express(async (req, res, next) => {
		try {
			let { page = 1, s = "desc", confirm = "all" } = req.query;
			const conditions = [];
			const data = [];
			let sql = this.#sql;

			// filtering
			if (confirm.toLowerCase() === "true") {
				conditions.push("confirmed = ?");
				data.push(1);
			} else if (confirm.toLowerCase() === "false") {
				conditions.push("confirmed = ?");
				data.push(0);
			}

			if (conditions.length > 0) {
				const whereClause = " WHERE " + conditions.join(" AND ");
				sql += whereClause;
			}

			// sorting
			const sortOrder = s.toLowerCase() === "desc" ? "DESC" : "ASC";
			sql += ` order by update_at ${sortOrder}`;

			// pagination
			const limit = 10;
			page = Number(page);
			const offset = (page - 1) * limit;
			sql += ` limit ? offset ?`;
			data.push(limit, offset);

			let [result] = await connection.execute(sql, data);
			result = result.map((order) => ({
				...order,
				productIds: JSON.parse(order.productIds),
			}));
			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(new UnExpectedError(error));
		}
	});
}

export default Orders;
