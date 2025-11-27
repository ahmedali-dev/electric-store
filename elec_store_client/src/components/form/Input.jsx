import React from "react";

const Input = ({ label, formik, showError = true, ...props }) => {
	return (
		<>
			{label && (
				<label className="text-[12px] mt-[1rem]">{label}: *</label>
			)}
			<input
				className={`bg-white shadow-md border p-[.6rem] rounded-[.3rem]  ${
					formik?.errors[props.name]
						? "border-red-400 outline-red-700 text-red-700"
						: "border-blue-400 outline-blue-700"
				}`}
				onChange={formik?.handleChange}
				value={formik?.values[props.name]}
				onBlur={formik?.handleBlur}
				{...props}
			/>
			{showError
				? formik?.errors[props.name] && (
						<p className="text-[12px] text-red-600">
							{formik?.errors[props.name]}
						</p>
				  )
				: null}
		</>
	);
};

export default Input;
