import catch_express from "./catch_express.js";
import ErrorHandler, { AuthorizationError, UserNotFound } from "./ErrorHandler.js";
import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import connection from "../db/connection.js";
import { removeRefreshCookie } from "./generateTokens.js";
export const protect = catch_express(async (req, res, next) => {
    // check toke found in the request
    let token = '';
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ').pop();
    }


    if (!token) {
        return next(new AuthorizationError())
    }

    // token verify
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.ACCESS_SECRET_KEY)
    } catch (error) {
        return next(error)
    }

    // check user is exist
    let [user] = await connection.execute('select username,id,email,password_change_at from users where id=?', [decoded.id]);
    if (!user || user.length === 0) {
        next(new UserNotFound());
        return;
    }

    // check user is update password
    user = user[0];
    const decodedDate = new Date(decoded.iat * 1000);
    const userUpdatedPassword = new Date(user.password_change_at);
    if (userUpdatedPassword > decodedDate) {
        removeRefreshCookie(res);
        return next(new ErrorHandler(401, {message: "Recently changed the password, Please login again"}));
    }

    req.user = user;
    next()

})


