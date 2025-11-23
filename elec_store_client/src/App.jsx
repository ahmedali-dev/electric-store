import { Navigate, redirect, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ActiveAccount from "./pages/ActiveAccount";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import useAuth from "./hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "./utils/ProtectedRoute";
import Layout from "./components/Layout.jsx";
import Categories from "./pages/categories/Categories.jsx";
import CategoriesProducts from "./pages/products/Products.jsx";
import Products from "./pages/products/Products.jsx";

const ROLES = {
	employee: "employee",
	store_manager: "store_manager",
	supervisor: "supervisor",
	admin: "admin",
};

const App = () => {
	const auth = useAuth();

	return (
		<div>
			<Routes>
				{/*  */}
				{/* auth routes */}
				{/*  */}
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/active_account" element={<ActiveAccount />} />
					<Route
						path="/forget_password"
						element={<ForgetPassword />}
					/>
					<Route path="/reset_password" element={<ResetPassword />} />
					<Route
						path="*"
						element={<Navigate to={"/login"} replace />}
					/>
				</Route>

				{/*  */}
				{/* protected routes */}
				{/*  */}

				<Route element={<ProtectedRoute role={"employee"} />}>
					<Route element={<Layout />}>
						<Route path="/" element={<div>store</div>} />
						<Route path="/orders" element={<div>orders</div>} />
					</Route>
				</Route>

				<Route element={<ProtectedRoute role={"admin"} />}>
					<Route element={<Layout />}>
						<Route path="/categories">
							<Route index element={<Categories />} />
							<Route path="add" element={<div>hello add</div>} />
							<Route path="edit" element={<div>edit</div>} />
							<Route path="delete" element={<div>delete</div>} />
						</Route>
						<Route path="/products">
							<Route index element={<Products />} />
						</Route>
						<Route path="/dashboard" element={<div>hello</div>} />
						<Route path="/orders" element={<div>orders</div>} />
					</Route>
				</Route>

				<Route path="*" element={<div>page not found</div>} />
			</Routes>
		</div>
	);
};

export default App;
