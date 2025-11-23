import React from "react";
import Table from "../../components/Table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatDate";

const Product = ({ data = [], loading }) => {
	if (!data.length) return <p>No products found.</p>;

	const keys = Object.keys(data[0]); // all column keys
	return (
		<>
			<Table className={"w-full"}>
				<Table.thead className={""}>
					<Table.tr className={"p-2"}>
						{data &&
							keys.map((key, idx) => (
								<Table.td
									key={key}
									className={`font-bold ${
										idx === 0
											? "rounded-tl-md rounded-bl-md"
											: ""
									}`}
								>
									{key.replace("_", " ").toUpperCase()}
								</Table.td>
							))}
						<Table.td className={"font-bold"}>EDIT</Table.td>
						<Table.td
							className={"font-bold rounded-tr-md rounded-br-md "}
						>
							DELETE
						</Table.td>
					</Table.tr>
				</Table.thead>
				<Table.tbody>
					{loading ? (
						<Table.loading colSpan={keys.length + 2} />
					) : (
						data.map((product) => {
							return (
								<Table.tr key={product.id}>
									{keys.map((key) => (
										<Table.td
											className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray"
											key={key}
										>
											{key === "update_at"
												? formatDate(product[key])
												: product[key]}
										</Table.td>
									))}

									<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray text">
										<button className="cursor-pointer text-primary">
											<FontAwesomeIcon icon={faEdit} />
										</button>
									</Table.td>

									<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray text">
										<button className="cursor-pointer text-red-500">
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</Table.td>
								</Table.tr>
							);
						})
					)}
				</Table.tbody>
			</Table>
		</>
	);
};

export default Product;
