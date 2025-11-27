import React from "react";
import Spinner from "./Spinner";
const selectClass = "w-full p-1 text-black rounded cursor-pointer";
const dropClass = "p-2 hover:bg-primary/60 rounded hover:text-white";
function DropDown({ loading = false, className, children }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [value, setValue] = React.useState(null);

	if (loading) {
		return <DropDown.Loading />;
	}
	return (
		<div className="App flex items-center justify-center ">
			<div
				className={`w-full shadow-md  border-2 border-primary bg-white relative text-white rounded mt-4 p-2 ${className}`}
			>
				<div
					className={`${selectClass} flex  items-center justify-center gap-3 uppercase `}
					onClick={() => {
						setIsOpen((prev) => !prev);
						// setValue(null);
					}}
				>
					{value || "Select an option"}
				</div>
				{isOpen && (
					<div
						className={`${selectClass} max-h-[200px] overflow-hidden overflow-y-auto  absolute top-12 left-0 bg-white mt-2`}
					>
						{children({ isOpen, setIsOpen, setValue })}
					</div>
				)}
			</div>
		</div>
	);
}

DropDown.Loading = function DropDownLoading() {
	return (
		<div className="App flex items-center justify-center ">
			<div className="w-full shadow-md  border-2 border-primary bg-white relative text-white rounded mt-4 p-2">
				<div className={`${selectClass} flex  items-center justify-center gap-3 uppercase`}>
					<Spinner size={20} />
				</div>
			</div>
		</div>
	);
};

DropDown.Option = function DropDownOption({ className, children, ...props }) {
	return (
		<div className={`${dropClass} ${className}`} {...props}>
			{children}
		</div>
	);
};
export default DropDown;
