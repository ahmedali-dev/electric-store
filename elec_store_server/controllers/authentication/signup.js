import { getUserByEmail, createUser } from '../../db/tables/users.db.js'
import catch_express from "../../utils/catch_express.js";
import validation from '../../utils/validation.js'
import { z } from 'zod';
import { v7 } from 'uuid'
import { generateToken, hashPassword, randomNumber } from "../../utils/hashing.js";
import { sendEmailTemplate } from '../../utils/MailTemplate.js';
import ErrorHandler, { UnExpectedError } from '../../utils/ErrorHandler.js';
// validation input (username , email, password, confirm_password)
export const signup_input_schema = z.object({
    username: validation.validate_inputs.username,
    email: validation.validate_inputs.email,
    password: validation.validate_inputs.password,
    password_confirm: validation.validate_inputs.password_confirm
}).refine((data) => data.password === data.password_confirm, {
    message: "password not match",
    path: ['password_confirm', 'password']
})
export function activeAccountToken() {
    const { token, token_hash } = generateToken();
    const expire = new Date(Date.now() + 1000 * 60 * 5);
    const code = randomNumber(10);
    return { token, token_hash, code, expire }

}
export const signup_input_validate = validation.validate(signup_input_schema, 'body');
export const signup = catch_express(async (req, res, next) => {

    try {
        // check if user is exist
        const [user] = await getUserByEmail(req.body.email, ['email']);
        if (user.length > 0) {
            next(new ErrorHandler(404, {
                message: "Email is already registered"
            }))
            return;
        }

        // hashing password
        const passwordHash = hashPassword(req.body.password);

        // add new user 
        const { token, token_hash, expire, code } = activeAccountToken();

        const id = v7();
        await createUser(id, req.body.username, req.body.email, passwordHash, code, token_hash, expire);

        sendEmailTemplate(req.body.email, token, id).catch(err => {
            console.log(err)
        })


        res.status(200).json({
            success: true,
            message: 'SignUp Successfully please check your email'
        })

    } catch (error) {
        next(new UnExpectedError(error))
    }

})