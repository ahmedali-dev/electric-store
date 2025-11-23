import { UnExpectedError } from "./ErrorHandler.js";

const catch_express = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        next(new UnExpectedError(err))
    }
}

export default catch_express