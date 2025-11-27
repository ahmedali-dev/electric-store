import React from "react";

const InputGroup = ({ children, style, ...props }) => {
	return (
		<div className={`flex flex-col gap-1.5 text-start ${style}`} {...props}>
			{children}
		</div>
	);
};

export default InputGroup;
