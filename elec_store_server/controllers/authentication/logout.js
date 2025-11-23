import catch_express from "../../utils/catch_express.js";
import { UnExpectedError, UserNotFound } from "../../utils/ErrorHandler.js";
import { removeRefreshCookie } from "../../utils/generateTokens.js";


const logout = catch_express(async (req, res, next) => {
    try {
        const user = req.user;

        // check user found
        if (!user) {
            next(new UserNotFound(null));
            return;
        }

        // remove cookie
        removeRefreshCookie(res);

        return res.status(200).json({
            success: true,
            message: 'logout successfully'
        })
    } catch (err) {
        next(new UnExpectedError(err));
    }
})

export default logout;