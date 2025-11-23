import { useFormik } from 'formik';
import Form from '../components/form/form';
import { useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
const validationSchema = yup.object().shape({
    password: yup.string().required("Password is Require").min(8, 'Password must be greeter than 8 character').max(32, "Password must be less than 32 character").matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?\":{}|<>_\-+=]/, "Password must contain at least one special character"),
    password_confirm: yup.string().required("Confirm Password is require").oneOf([yup.ref('password'), null], "Password not match")
});

const initialValues = {
    password: '',
    password_confirm: ''
};


const ResetPassword = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (value, action) => {
            const data = { password: value.password, password_confirm: value.password_confirm, id: params.get('id'), token: params.get('token') };
            mutate(data);
            action.setSubmitting(false);
        }
    })

    const { mutate } = useMutation({
        mutationFn: async (data) => await axios.post('auth/reset_password', data),
        onSuccess: (e) => {
            toast.success(e?.data?.message);
            navigate('/login')
        },
        onError: (err) => {
            const res = err?.response?.data;
            toast.error(res?.message);

            if (err.errors) {
                formik.setErrors(err.errors);
            }
        }
    })
    return (
        <div className='flex justify-center items-center h-[100vh]'>
            <Form onSubmit={formik.handleSubmit}>

                <Form.input_group>
                    <Form.input type='password' name='password' placeholder='Password' formik={formik} label={'Password'} />
                </Form.input_group>

                <Form.input_group>
                    <Form.input type='password' name='password_confirm' placeholder='Password Confirm' formik={formik} label={'Confirm password'} />
                </Form.input_group>


                <Form.input_group>
                    <button type='submit' className={'bg-primary p-[.7rem] with-full rounded-[7px] shadow-md mt-[1rem] text-white cursor-pointer disabled:bg-gray-600'} disabled={formik.isSubmitting}>Send password reset link</button>
                </Form.input_group>

            </Form>
        </div>
    )
}

export default ResetPassword