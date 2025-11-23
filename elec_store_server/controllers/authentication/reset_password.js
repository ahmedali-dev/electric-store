import { getUserByEmail, getUserById, updateUser } from "../../db/tables/users.db.js";
import catch_express from "../../utils/catch_express.js";
import validation from "../../utils/validation.js";
import { generateToken, hashPassword, hashToken } from '../../utils/hashing.js';
import { z } from 'zod';
import { resetUserPasswordTemplate, sendEmailTemplate } from "../../utils/MailTemplate.js";
import ErrorHandler, { UnExpectedError, UserNotFound } from "../../utils/ErrorHandler.js";

const forget_input_schema = z.object({
    email: validation.validate_inputs.email
})




export const forget_input = validation.validate(forget_input_schema, 'body');
export const forget = catch_express(async (req, res, next) => {

    try {
        let [user] = await getUserByEmail(req.body.email, ['email', 'id', 'password_reset_token', 'password_reset_token_expire']);
        if (!user || user.length === 0) {
            next(new UserNotFound())
            return;
        }




        user = user[0];

        console.log(user)
        // check if user not have a token
        if (user.password_reset_token || user.password_reset_token_expire) {
            // check if token expire
            console.log('forget')
            const current = new Date();
            const expire_date = new Date(user.password_reset_token_expire);
            if (current > expire_date) {
                console.log('expire')
                const { token, token_hash } = generateToken();
                const expire_at = new Date(Date.now() + 1000 * 60 * 15); // active for 15m
                const data = [token_hash, expire_at, user.id];

                await updateUser('id=?', ['password_reset_token', 'password_reset_token_expire'], data);
                sendEmailTemplate(req.body.email, token, user.id, resetUserPasswordTemplate, 'reset_password');
            }
        } else {
            const { token, token_hash } = generateToken();
            const expire_at = new Date(Date.now() + 1000 * 60 * 15); // active for 15m
            const data = [token_hash, expire_at, user.id];

            await updateUser('id=?', ['password_reset_token', 'password_reset_token_expire'], data);
            sendEmailTemplate(req.body.email, token, user.id, resetUserPasswordTemplate, 'reset_password');
        }


        res.status(200).json({
            success: true,
            message: "please check user email address"
        })

    }
    catch (err) {
        next(new UnExpectedError(err))
    }

})


const reset_input_schema = z.object({
    token: z.string().nonempty("Token is require"),
    id: z.string().nonempty("Id is require"),
    password: validation.validate_inputs.password,
    password_confirm: validation.validate_inputs.password_confirm
}).refine((data) => data.password === data.password_confirm, {
    message: "password is not match",
    path: ['password', 'password_confirm']
});

export const reset_input = validation.validate(reset_input_schema, 'body');
export const reset = catch_express(async (req, res, next) => {
    // get user by id and token
    try {
        const { id, token, password } = req.body;
        let [user] = await getUserById(id);

        if (!user || user.length === 0) {
            next(new UserNotFound())
            return;
        }

        user = user[0]

        // check if token and expire is found 
        if (!user.password_reset_token || !user.password_reset_token_expire) {
            next(new ErrorHandler(400, { message: 'Invalid token or expired' }))
            return;
        }

        // token expire
        const now = new Date();
        const expire = new Date(user.password_reset_token_expire)
        console.log(now, expire)
        if (expire < now) {
            next(ErrorHandler(400, {
                message: 'Token expired'
            }))
            return;
        }

        // compare token hash
        const token_hash = hashToken(token);
        console.log(token_hash, user.password_reset_token)
        if (token_hash !== user.password_reset_token) {
            next(new ErrorHandler(400, { message: "invalid token" }));
            return;
        }
        const password_hash = hashPassword(password);
        await updateUser(
            'id=?',
            ['password', 'password_reset_token', 'password_reset_token_expire', 'password_change_at'],
            [password_hash, null, null, now, id]
        )

        res.status(200).json({
            success: true,
            message: "Password is updated 😊"
        })
    } catch (err) {
        next(new UnExpectedError(err))
    }

})