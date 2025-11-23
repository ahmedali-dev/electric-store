import bcrypt from 'bcrypt';
import catch_express from "../../utils/catch_express.js";
import validation from "../../utils/validation.js";
import { getUserByEmail } from '../../db/tables/users.db.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import connection from '../../db/connection.js';
import { activeAccountToken } from './signup.js';
import { sendEmailTemplate } from '../../utils/MailTemplate.js';
import ErrorHandler, { UnExpectedError, UserNotFound } from '../../utils/ErrorHandler.js';
import { accessToken, refreshCookie } from '../../utils/generateTokens.js';

const login_input_schema = z.object({
    email: validation.validate_inputs.email,
    password: validation.validate_inputs.password
})

export const login_input_validate = validation.validate(login_input_schema, 'body');
// // 
export const login = catch_express(async (req, res, next) => {

    try {
        // check if user is not exist
        let [user] = await getUserByEmail(req.body.email)
        if (!user || user.length === 0) {
            next(new UserNotFound(null));
            return;
        }

        user = user[0];


        // check if password is valid
        const password = req.body.password;
        const passwordHash = user.password
        if (!bcrypt.compareSync(password, passwordHash)) {
            next(new ErrorHandler(401, {
                success: false,
                message: "Incorrect email or password"
            }, null))
            return;
        }

        // check user is active
        if (!user.is_active) {


            // check if code is not expire
            const now = new Date();
            const expire = new Date(user.is_active_code_token_expire);
            if (now > expire) {
                console.log('expire')
                const { token, token_hash, expire, code } = activeAccountToken();
                await connection
                    .execute(
                        'update users set is_active_code = ?, is_active_code_token = ?, is_active_code_token_expire = ? where id = ?',
                        [code, token_hash, expire, user.id]
                    )

                sendEmailTemplate(req.body.email, token, user.id).catch(err => {
                    console.log("Email sender error : ", err)
                })
            }

    
            next(new ErrorHandler(400, {
                success: false,
                message: 'User is not active please check you email'
            }, null))
            return;
        }

        

        
       const token = accessToken(user);
       refreshCookie(user, res);


        res.status(200).json({
            success: true,
            message: "login successfully.",
            token
        })

    }
    catch (err) {
        next(new UnExpectedError(err))
    }
})



