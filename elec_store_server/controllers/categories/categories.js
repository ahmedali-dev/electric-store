import connection from "../../db/connection.js";
import catch_express from "../../utils/catch_express.js";
import ErrorHandler, { UnExpectedError } from "../../utils/ErrorHandler.js";
import { z } from 'zod';
import validation from "../../utils/validation.js";
import { v7 } from "uuid";

const id_schema = z.object({
    id: z.string("Id must be string").nonempty("Id is require"),
});
export const id_validation = validation.validate(id_schema, 'params');


export async function existsCategory(filter, where = 'id=?') {

    const [category] = await connection.execute('select id from categories where ' + where, filter);
    return category.length > 0

}


export const get = catch_express(async (req, res, next) => {
    try {
        const { s = 'desc' } = req.query;
        const validSort = ['asc', 'desc']
        let sql = 'select * from categories';
        if (s && validSort.includes(s)) {
            sql += ' order by update_at ' + s;
        }
        const [categories] = await connection.execute(sql);
        return res.status(200).json({
            success: true,
            data: categories
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }
})

const post_schema = z.object({
    name: z.string("Name must be string").nonempty("Name is require")
});

export const post_validation = validation.validate(post_schema, 'body');
export const post = catch_express(async (req, res, next) => {
    try {
        const { name } = req.body;


        // check if the name exist
        if (await existsCategory([name], 'name = ?')) {
            next(new ErrorHandler(409, {
                success: false,
                message: "category is found"
            }))
            return;
        }

        const data = [v7(), name];
        await connection.execute('insert into categories(id,name) values (?,?)', data);
        return res.status(200).json({
            success: true,
            message: 'Categories Added Successfully'
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }
})


export const patch = catch_express(async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        // check if category is found
        if (!(await existsCategory([id]))) {
            next(new ErrorHandler(409, {
                success: false,
                message: "category is not found"
            }))
            return;
        }


        // check name is not used before
        const [[{nameUsed}]] = await connection.execute('select name as nameUsed from categories where name = ?', [name]);
        if (nameUsed) {
            next(new ErrorHandler(409, {
                success: false,
                message: "category name used before"
            }))
            return;
        }

        await connection.execute('update categories set name = ? where id= ? ', [name, id]);
        return res.status(200).json({
            success: true,
            message: "Category has updated successfully"
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }
});


export const Delete = catch_express(async (req, res, next) => {
    try {
        const { id } = req.params;

        // check category is found
        if (!(await existsCategory([id]))) {
            next(new ErrorHandler(409, {
                success: false,
                message: "category is not found"
            }))
            return;
        }

        await connection.execute('delete from categories where id = ?', [id]);

        return res.status(200).json({
            success: true,
            message: "Category has deleted successfully"
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }
});



export const search_validation = validation.validate(z.object({
    name: z.string("Name Must By String").nonempty("Name is require").max(100, "Name must be less than 100")
}), 'body')
export const search = catch_express(async (req, res, next) => {
    try {
        const { name } = req.body;

        const sql = 'select id, name, update_at from categories where name like ?';
        let [categories] = await connection.execute(sql, ["%" + name + "%"]);

        return res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        next(new UnExpectedError(error));
    }
})