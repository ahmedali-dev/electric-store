import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faAdd } from "@fortawesome/free-solid-svg-icons";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/Button";
import CategoriesTable from "./CategoriesTable";
import AddCategory from "./AddCategory";
import DeleteCategory from "./DeleteCategory";
import EditCategory from "./EditCategory";
import SearchCategories from "./SearchCategories";
import { CATEGORY_QUERY_KEY } from "./constants";

const Categories = () => {
	const { decoded } = useAuth();
	const addDialogRef = useRef();
	const deleteDialogRef = useRef();
	const editDialogRef = useRef();
	const searchRef = useRef();
	const axios = useAxiosPrivate();

	const [sortByDate, setSortByDate] = useState("asc");

	const { data, isLoading, isPending, isError, error, refetch } = useQuery({
		queryKey: CATEGORY_QUERY_KEY,
		queryFn: () => axios.get(`categories?s=${sortByDate}`),
	});

	const handleRefresh = () => {
		searchRef.current?.formik?.resetForm();
		refetch();
	};

	useEffect(() => {
		refetch();
	}, [sortByDate, refetch]);

	if (isError) {
		return <div className="p-3 text-red-500">Error loading categories</div>;
	}
	return (
		<>
			{/* add new category */}
			<AddCategory ref={addDialogRef} />
			{/* delete category */}
			<DeleteCategory ref={deleteDialogRef} />
			{/* edit category */}
			<EditCategory ref={editDialogRef} />

			<div className="p-3">
				{/* search */}
				<SearchCategories ref={searchRef} />

				{/* category List */}
				<div className="mt-8 gap-1 flex items-center justify-start flex-wrap">
					{/* more option */}
					<div className="flex items-center gap-4 justify-start">
						{decoded.kind === "admin" && (
							<button
								onClick={() =>
									addDialogRef.current?.openDialog()
								}
								className="p-2 text-white bg-primary rounded cursor-pointer hover:opacity-90"
							>
								Add Category <FontAwesomeIcon icon={faAdd} />
							</button>
						)}
						<Button
							loading={isLoading}
							disabled={isPending}
							onClick={handleRefresh}
							className="bg-black! p-2 text-white! rounded! cursor-pointer! disabled:bg-gray-500!"
						>
							<FontAwesomeIcon icon={faRefresh} />
						</Button>
					</div>

					<CategoriesTable
						loading={isLoading}
						sortByDate={sortByDate}
						setSortByDate={setSortByDate}
						data={data?.data?.data || []}
						showDeleteDialog={
							deleteDialogRef.current?.showDeleteDialog
						}
						showEditDialog={editDialogRef?.current?.showEditDialog}
					/>
				</div>
			</div>
		</>
	);
};

export default Categories;
