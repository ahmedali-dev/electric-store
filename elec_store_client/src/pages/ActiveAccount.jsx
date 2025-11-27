import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "./../utils/axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
const ActiveAccount = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const params = new URLSearchParams(location.search);
	const { mutate, isPending, isError, isSuccess } = useMutation({
		mutationFn: async (data) => {
			return await axios.post("auth/active_user", data);
		},
		onError: (err) => {
			const res = err?.response?.data;
			toast.error(res.message);
		},
		onSuccess: (e) => {
			navigate("/login", { state: location.state });
		},
	});

	useEffect(() => {
		mutate({ id: params.get("id"), token: params.get("token") });
	}, [location]);

	return (
		<div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
				{isPending && (
					<div>
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500 mx-auto"></div>
						<h2 className="mt-6 text-xl font-semibold text-gray-700">Verifying your account...</h2>
					</div>
				)}

				{isSuccess && (
					<div>
						<div className="text-green-600 text-7xl mb-4">✔</div>
						<h2 className="text-2xl font-bold text-green-700">Account Activated!</h2>
						<p className="text-gray-600 mt-2">Your account has been successfully activated.</p>
					</div>
				)}

				{isError && (
					<div>
						<div className="text-red-600 text-7xl mb-4">✖</div>
						<h2 className="text-2xl font-bold text-red-700">Activation Failed</h2>
						<p className="text-gray-600 mt-2">Invalid or expired activation link.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ActiveAccount;
