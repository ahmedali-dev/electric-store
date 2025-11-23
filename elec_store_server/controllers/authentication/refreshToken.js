import catch_express from "../../utils/catch_express.js";
import { AuthorizationError, UserNotFound } from "../../utils/ErrorHandler.js";
import { promisify } from 'util'
import jwt from 'jsonwebtoken';
import { getUserById } from "../../db/tables/users.db.js";
import { accessToken } from "../../utils/generateTokens.js";
export const refreshToken = catch_express(async (req, res, next) => {

    // check if refresh_token found in the cooke
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
        return next(new AuthorizationError());
    }

    // verify refresh token
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(refresh_token, process.env.REFRESH_SECRET_KEY);
    } catch (error) {
        return next(error);
    }



    // check user is found
    let [user] = await getUserById(decoded.id);
    if (!user || user.length === 0) {
        next(new UserNotFound());
        return;
    }

    user = user[0];

    // create new token
    const access_token = accessToken(user);

    res.status(200).json({
        success: true,
        token: access_token
    })
})