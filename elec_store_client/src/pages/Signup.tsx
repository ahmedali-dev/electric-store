import { useFormik } from 'formik'
import * as yup from 'yup';
import Form from '../components/form/form';
import { Link, useNavigate } from 'react-router-dom';
import axios from './../utils/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Button from '../components/Button';


const validationSchema = yup.object().shape({
    username: yup.string().required("Username is Require").min(3, "Username must be greeter than 3 character").max(32, 'Username must be less than 32 character'),
    email: yup.string().required("Email is require").email("Inter a valid email"),
    password: yup.string().required("Password is Require").min(8, 'Password must be greeter than 8 character').max(32, "Password must be less than 32 character").matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?\":{}|<>_\-+=]/, "Password must contain at least one special character"),
    password_confirm: yup.string().required("Confirm Password is require").oneOf([yup.ref('password'), null], "Password not match")
})


const initialValues = {
    username: "",
    email: "",
    password: "",
    password_confirm: ""
}
const Signup = () => {
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (value, action) => {
            mutate(value);
            action.setSubmitting(false)
        }
    });

    const navigate = useNavigate();
    const { mutate, isSuccess, data, isError, error } = useMutation({
        mutationFn: async (data) => {
            return await axios.post('auth/signup', data);
        },
        onSuccess: (data) => {
            toast.success(data.data?.message);
            navigate('/login')
            formik.setSubmitting(false);
        }
    });

    // ✅ FIX: Handle error outside render
    useEffect(() => {
        if (!isError) return;

        const err = error?.response?.data;
        toast.dismiss();
        toast.error(err?.message);

        if (err?.errors) {
            formik.setErrors(err.errors);
        }
        formik.setSubmitting(false);
    }, [isError, error]); // only runs when error changes

    return (
        <div className='flex justify-center items-center h-[100vh]'>
            <Form onSubmit={formik.handleSubmit}>
                <div className='text-center mb-[.6rem]'>
                    <h1 className='text-[2rem]'>Signup</h1>
                    <p>Create new account</p>
                </div>
                <Form.input_group style={''}>
                    <Form.input type='text' name='username' placeholder='Username' formik={formik} label='Username' />
                </Form.input_group>
                <Form.input_group style={''}>
                    <Form.input name='email' type='email' placeholder='Email' formik={formik} label='Email' />
                </Form.input_group>
                <Form.input_group style={''}>
                    <Form.input type='password' name='password' placeholder='Password' formik={formik} label='Password' />
                </Form.input_group>
                <Form.input_group style={''}>
                    <Form.input type='password' name='password_confirm' placeholder='Password Confirm' formik={formik} label='Confirm Password' />
                </Form.input_group>
                <Form.input_group style={''}>
                    <Button loading={formik.isSubmitting} type='submit' className='bg-primary p-[.7rem] with-full rounded-[7px] shadow-md mt-[1rem] text-white cursor-pointer disabled:bg-gray-600' disabled={formik.isSubmitting}>
                        Signup
                    </Button>
                </Form.input_group>
                <Form.input_group style={''}>
                    <Link className='mt-[1rem]' to={'/login'}>
                        You have <span className='text-primary uppercase'>account?</span>
                    </Link>
                </Form.input_group>
            </Form>
        </div>
    );
};

export default Signup