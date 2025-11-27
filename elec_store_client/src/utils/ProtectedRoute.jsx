import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
export function PublicRoute() {
	const auth = useAuth();
	const location = useLocation();
	return auth.isLogin && auth.token ? <Navigate to={"/"} state={{ from: location }} replace /> : <Outlet />;
}

function RoleNavigate({ role }) {
	const roles = ["employee", "store_manager", "supervisor", "admin"];
	const location = useLocation();
	if (!roles.includes(role)) {
		return <Navigate to="/notfound" state={{ from: location }} replace={true} />;
	}

	switch (role) {
		case "employee":
		case "store_manager":
		case "supervisor":
			return <Navigate to="/order" state={location.state} replace={true} />;
		case "admin":
			return <Navigate to="/dashboard" state={location.state} />;
		default:
			return <Navigate to="/notfound" state={location.state} />;
	}
}

export function ProtectedRoute({ role, ...props }) {
	const { decoded, isLogin, token } = useAuth();
	const location = useLocation();

	// check token found

	if (!isLogin || !token) {
		return <Navigate to={"/login"} state={{ from: location }} replace />;
	}

	if (role !== decoded.kind) {
		return <RoleNavigate role={decoded.kind} />;
	}

	return <Outlet />;
}
