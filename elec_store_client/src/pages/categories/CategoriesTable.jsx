import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTrash,
	faArrowUp,
	faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

import Table from "../../components/Table/Table";
import { formatDate } from "../../utils/formatDate";
import useAuth from "../../hooks/useAuth";

const CategoriesTable = ({
	sortByDate,
	setSortByDate,
	showDeleteDialog,
	showEditDialog,
	data,
	loading,
}) => {
	const { decoded } = useAuth();
	return (
		<Table>
			<Table.thead className="text-left p-4 bg-primary font-bold">
				<Table.tr>
					<Table.td className="rounded-tl-md rounded-bl-md">
						ID
					</Table.td>
					<Table.td>NAME</Table.td>
					<Table.td
						onClick={() =>
							setSortByDate((prev) =>
								prev === "asc" ? "desc" : "asc"
							)
						}
						className="cursor-pointer hover:opacity-70"
					>
						<FontAwesomeIcon
							icon={
								sortByDate === "asc" ? faArrowDown : faArrowUp
							}
						/>
						<span className="ml-2">UPDATE TIME</span>
					</Table.td>
					<Table.td>EDIT</Table.td>
					<Table.td className="rounded-tr-md rounded-br-md">
						DELETE
					</Table.td>
				</Table.tr>
			</Table.thead>

			<Table.tbody>
				{loading ? (
					<Table.loading colSpan={5} />
				) : (
					data &&
					data.map((category) => {
						return (
							<Table.tr key={category.id}>
								<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray">
									{category.id}
								</Table.td>
								<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray">
									<Link
										to={"/products?id=" + category.id}
										className="w-max-content p-3 rounded bg-gray hover:scale(1.03) hover:shadow-md hover:shadow-primary/50 hover:bg-primary hover:text-white Table.transition"
									>
										{category.name}
									</Link>
								</Table.td>
								<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray">
									{formatDate(category.update_at)}
								</Table.td>
								{decoded.kind === "admin" && (
									<>
										<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray ">
											<button
												onClick={() =>
													showEditDialog({
														id: category.id,
														name: category.name,
													})
												}
												className="cursor-pointer text-primary"
											>
												<FontAwesomeIcon
													icon={faEdit}
												/>
											</button>
										</Table.td>
										<Table.td className="pl-2 !text-black pb-4 pt-6 border-b-1 border-gray text">
											<button
												onClick={() =>
													showDeleteDialog({
														id: category.id,
														name: category.name,
													})
												}
												className="cursor-pointer text-red-500"
											>
												<FontAwesomeIcon
													icon={faTrash}
												/>
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
	);
};

export default CategoriesTable;
