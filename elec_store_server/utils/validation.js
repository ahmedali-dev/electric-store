
import { z } from 'zod';
import { ValidationError } from './ErrorHandler.js';
const validate_inputs = {
    username: z.string('Username is require').nonempty("Username is require").min(3, "Username must greeter than 3 character").max(32, 'Username must be less then 32 character'),
    email: z.string("Email is require").nonempty('Email is require').email().refine((email) => {
        const domain_valid = ['gmail.com', 'yahoo.com', 'outlook.com', 'tiffincrane.com'];
        const my_domain = email.split('@')
        return domain_valid.includes(my_domain[my_domain.length - 1]);
    }, { message: 'Invalid domain name' }),
    password: z.string("Password is Require").nonempty("Password is required").min(8, "Password must be greeter then 8 character").max(32, "Password must be less then 32 character").refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
    })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(val), {
            message: "Password must contain at least one special character",
        }),
    password_confirm: z.string().nonempty('Password confirm is require')

}


const validate = (schema_object, source) => (req, res, next) => {
    const schema_parse = z.safeParse(schema_object, req[source])

    if (!schema_parse.success) {
        let errors = schema_parse.error.flatten().fieldErrors;
        Object.entries(errors).map(([key, value]) => {
            errors[key] = value[0]
        })
        console.log(errors)
        next(new ValidationError(errors, null))
        return;
    }

    req[source] = schema_parse.data;
    next();
}

const validation = {
    validate,
    validate_inputs
}

export default validation