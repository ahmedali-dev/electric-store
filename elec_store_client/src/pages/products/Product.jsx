import React from "react";
import Table from "../../components/Table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatDate";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import EditProduct from "./EditProduct";
import { useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";

const Product = ({ data = [], setParams, params, getProducts, loading }) => {
	const EditProductRef = useRef();
	const { decoded } = useAuth();
	const axios = useAxiosPrivate();
	const deleteItem = useMutation({
		mutationKey: ["products"],
		mutationFn: async (id) => (await axios.delete(`/products/${id}`)).data,
		onSuccess: (data) => {
			ToastHandler({ data: { data } });
			getProducts.refetch();
		},
		onError: (error) => {
			ToastHandler({ error });
		},
	});

	function sortByDate() {
		setParams((prev) => {
			const currentSort = prev.get("s") || "asc";
			const newSort = currentSort === "asc" ? "desc" : "asc";
			prev.set("s", newSort);
			return prev;
		});
		getProducts.refetch();
	}

	if (!data.length) return <p>No products found.</p>;
	const keys = Object.keys(data[0]); // all column keys

	return (
		<>
			<EditProduct ref={EditProductRef} />
			<Table className={"w-full"}>
				<Table.thead className={""}>
					<Table.tr className={"p-2"}>
						{data &&
							keys.map((key, idx) => {
								if (key === "update_at") {
									return (
										<Table.td
											key={key}
											className={`font-bold ${idx === 0 ? "rounded-tl-md rounded-bl-md" : ""}`}
											onClick={sortByDate}
											style={{ cursor: "pointer" }}
										>
											{params.get("s") === "asc" ? (
												<FontAwesomeIcon icon={faArrowUp} />
											) : (
												<FontAwesomeIcon icon={faArrowDown} />
											)}
											{key.replace("_", " ").toUpperCase()}
										</Table.td>
									);
								}
								return (
									<Table.td
										key={key}
										className={`font-bold ${idx === 0 ? "rounded-tl-md rounded-bl-md" : ""}`}
									>
										{key.replace("_", " ").toUpperCase()}
									</Table.td>
								);
							})}
						<Table.td className={"font-bold"}>EDIT</Table.td>
						<Table.td className={"font-bold rounded-tr-md rounded-br-md "}>DELETE</Table.td>
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
											{key === "update_at" ? formatDate(product[key]) : product[key]}
										</Table.td>
									))}

									{decoded.kind === "admin" && (
										<>
											<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray text">
												<button
													onClick={() => EditProductRef.current?.openDialog(product.id)}
													className="cursor-pointer text-primary"
												>
													<FontAwesomeIcon icon={faEdit} />
												</button>
											</Table.td>

											<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray text">
												<button
													onClick={() => deleteItem.mutate(product.id)}
													className="cursor-pointer text-red-500"
												>
													<FontAwesomeIcon icon={faTrash} />
												</button>
											</Table.td>
										</>
									)}
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
