import Spinner from "../Spinner";

const Table = ({ children, className, ...props }) => {
	return (
		<table
			className={"w-full border-collapse mt-1 " + className}
			{...props}
		>
			{children}
		</table>
	);
};

Table.thead = ({ children, className, ...props }) => (
	<thead
		className={"text-left p-4 bg-primary font-bold" + className}
		{...props}
	>
		{children}
	</thead>
);

Table.tbody = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;

Table.tr = ({ children, className, ...props }) => (
	<tr className={className} {...props}>
		{children}
	</tr>
);
Table.td = ({ children, className, ...props }) => (
	<td className={"pl-2 pt-4 pb-4 text-white " + className} {...props}>
		{children}
	</td>
);
Table.loading = function ({ colSpan }) {
	return (
		<tr>
			<td className="w-full" colSpan={colSpan}>
				<div className="p-3 flex w-full items-center justify-center">
					<Spinner size={30} />
				</div>
			</td>
		</tr>
	);
};

export default Table;
