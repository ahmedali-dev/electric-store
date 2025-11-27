import { useFormik } from "formik";
import * as yup from "yup";
import Form from "../components/form/form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "./../utils/axios";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
const validationSchema = yup.object().shape({
	email: yup.string().required("Email is require").email("Inter a valid email"),
	password: yup
		.string()
		.required("Password is Require")
		.min(8, "Password must be greeter than 8 character")
		.max(32, "Password must be less than 32 character")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[!@#$%^&*(),.?\":{}|<>_\-+=]/, "Password must contain at least one special character"),
});

const initialValues = {
	email: "",
	password: "",
};
const Login = () => {
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (value, action) => {
			mutate(value);
			// action.setSubmitting(false);
		},
	});

	const auth = useAuth();
	const navigate = useNavigate();
	const { mutate } = useMutation({
		mutationFn: async (data) => {
			return await axios.post("/auth/login", data);
		},
		onSuccess: (data) => {
			auth.login(data?.data?.token);
			navigate("/");
		},
		onError: (err) => {
			const res = err?.response?.data;
			toast.dismiss();
			toast.error(res.message);
			formik.setSubmitting(false);
		},
	});
	return (
		<div className="flex justify-center items-center h-[100vh]">
			<Form onSubmit={formik.handleSubmit}>
				<div className="text-center mb-[.6rem]">
					<h1 className="text-[2rem]">Signup</h1>
					<p>Create new account</p>
				</div>

				<Form.input_group>
					<Form.input name="email" type="email" placeholder="Email" formik={formik} label={"Email"} />
				</Form.input_group>

				<Form.input_group>
					<Form.input
						type="password"
						name="password"
						placeholder="Password"
						formik={formik}
						label={"Password"}
					/>
				</Form.input_group>

				<Form.input_group>
					<Link to={"/forget_password"} className="text-end text-primary m-1">
						Forget password
					</Link>
				</Form.input_group>

				<Form.input_group>
					<Button
						type="submit"
						className={
							"bg-primary p-[.7rem] with-full rounded-[7px] shadow-md mt-[1rem] text-white cursor-pointer disabled:bg-gray-600"
						}
						loading={formik.isSubmitting}
					>
						Login
					</Button>
				</Form.input_group>

				<Form.input_group>
					<Link className="mt-[1rem]" to={"/signup"}>
						Create new <span className="text-primary uppercase">account?</span>
					</Link>
				</Form.input_group>
			</Form>
		</div>
	);
};

export default Login;
