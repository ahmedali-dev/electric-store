import Spinner from "./Spinner";

const Button = ({ className, loading, spinnerSize = 20, children, ...props }) => {
	return (
		<button
			{...props}
			className={
				"flex items-center justify-center p-2 cursor-pointer disabled:bg-secondary bg-primary rounded  text-center text-white " +
				className
			}
			disabled={loading || props.disabled}
		>
			{loading ? <Spinner size={spinnerSize} /> : children}
		</button>
	);
};

export default Button;
