import { useFormik } from 'formik'
import axios from './../utils/axios';
import Form from '../components/form/form';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object().shape({
    email: yup.string().required("Email is require").email("Inter a valid email")
})

const initialValues = {
    email: ''
}

const ForgetPassword = () => {
    const formik = useFormik(
        {
            initialValues,
            validationSchema,
            onSubmit: (value, action) => {
                mutate(value);
                action.setSubmitting(false);
            }
        }
    );

    const navigate = useNavigate();


    const { mutate } = useMutation({
        mutationFn: async (data) => await axios.post('auth/forget_password', data),
        onSuccess: (e) => {
            toast.success(e?.data?.message);
            navigate('/login')
        },
        onError: (err) => {
            const res = err?.response?.data;
            toast.error(res?.message);
        }
    })
    return (
        <div className='flex justify-center items-center h-[100vh]'>
            <Form onSubmit={formik.handleSubmit}>

                <Form.input_group>
                    <Form.input label={'Email'} name='email' placeholder='Password' formik={formik} />
                </Form.input_group>


                <Form.input_group>
                    <button type='submit' className={'bg-primary p-[.7rem] with-full rounded-[7px] shadow-md mt-[1rem] text-white cursor-pointer disabled:bg-gray-600'} disabled={formik.isSubmitting}>Send password reset link</button>
                </Form.input_group>

            </Form>
        </div>
    )
}

export default ForgetPassword