import React from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SideBar from "./SideBar";
const Layout = ({ children, ...props }) => {
	const { decoded } = useAuth();
	return (
		<div>
			<div className="flex gap-1 max-w-[1480px] m-auto ">
				<SideBar role={decoded.kind} name={decoded.username} />
				<div className="container">
					{/* <div className="navbar">navbar</div> */}
					<div className="content relative h-full">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
