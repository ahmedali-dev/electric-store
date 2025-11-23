class ErrorHandler {
    production = process.env.PRODUCTION || false;

    constructor (status, response, stack=null) {
        this.status = status;
        response = {success: false,...response}
        this.response = response;
        this.stack = this.production ? null : stack;
    }
}


export class ValidationError extends ErrorHandler {
    constructor(errors, stack=null) {
        super(400, {
            message: "validation error",
            errors
        }, stack)
    }
}

export class UserNotFound extends ErrorHandler {
    constructor(stack) {
        super(404, {
            message: 'user not found'
        }, stack)
    }
}

export class UnExpectedError extends ErrorHandler {
    constructor(stack) {
        super(500, {message: "UnExpected Error"}, stack);
    }
}


export class AuthorizationError extends ErrorHandler {
    constructor(stack=null) {
        super(401, {
            message: "Are you logout, Please login and try again"
        })
    }
}

export class NotValidToken extends ErrorHandler {
    constructor(stack=null) {
        super(403, {
            message: "Token not valid, Please login again" 
        })
    }
}


export default ErrorHandler;