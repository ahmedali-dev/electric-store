import catch_express from "../../utils/catch_express.js";
import { getUserById, updateUser } from "../../db/tables/users.db.js";
import { hashToken } from "../../utils/hashing.js";
import validation from "../../utils/validation.js";
import { z } from "zod";
import ErrorHandler, { UnExpectedError, UserNotFound } from "../../utils/ErrorHandler.js";


const active_input_schema = z.object({
    token: z.string().nonempty('Token is require').min(1, 'Token is require'),
    id: z.string().nonempty('Id is require').min(1, 'token is require')
})

export const active_input = validation.validate(active_input_schema, 'body');
export const active_user = catch_express(async (req, res, next) => {
    // check if user is exist using id

    try {
        let [user] = await getUserById(req.body.id, ['is_active, is_active_code', 'is_active_code_token', 'is_active_code_token_expire']);
        if (!user || user.length === 0) {
            next(new UserNotFound());
            return;
        }

        user = user[0];
        console.log(user)

        // check user is not active
        if (user.is_active) {
            next(new ErrorHandler(400, {
                success: false,
                message: "User is already active"
            }));
            return;
        }

        // check if user have token and code and expire
        if (!user.is_active_code_token || !user.is_active_code_token_expire) {
            next(new ErrorHandler(400, {
                success: false,
                message: "Invalid Token or Code or Expired token"
            }));
            return;
        }




        // check expire token
        const current = new Date();
        const expire_date = new Date(user.is_active_code_token_expire);
        if (current > expire_date) {
            next(new ErrorHandler(400, {
                success: false,
                message: "Expire token"
            }));
            return;
        }


        // check token
        const token_hash = hashToken(req.body.token);
        if (user.is_active_code_token !== token_hash) {
            next(new ErrorHandler(400, {
                success: false,
                message: "Invalid token"
            }));
            return;
        }

        // update user and active account
        await updateUser('id=?', ['is_active', 'is_active_code', 'is_active_code_token', 'is_active_code_token_expire'], [true, null, null, null, req.body.id])

        res.status(200).json({
            success: true,
            message: "User is Activating successfully"
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }

})