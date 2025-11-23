import { useState, forwardRef, useImperativeHandle } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Dialog from "../../components/Dialog";
import { ToastHandler } from "../../utils/ToastHandler";
import { CATEGORY_QUERY_KEY } from "./constants";

const DeleteCategory = forwardRef((props, ref) => {
	const [category, setCategory] = useState(null);
	const queryClient = useQueryClient();
	const axios = useAxiosPrivate();

	const deleteMutation = useMutation({
		mutationKey: CATEGORY_QUERY_KEY,
		mutationFn: (id) => axios.delete(`categories/${id}`),
		onSuccess: (data) => {
			queryClient.invalidateQueries(CATEGORY_QUERY_KEY);
			ToastHandler({ data });
			closeDialog();
		},
		onError: (error) => {
			ToastHandler({ error });
			closeDialog();
		},
	});

	const openDialog = (cat) => {
		setCategory(cat);
	};

	const closeDialog = () => {
		setCategory(null);
	};

	const handleDelete = () => {
		if (category?.id) {
			deleteMutation.mutate(category.id);
		}
	};

	useImperativeHandle(ref, () => ({
		showDeleteDialog: openDialog,
	}));

	return (
		category && (
			<Dialog
				isSubmitting={deleteMutation.isPending}
				action={handleDelete}
				open={!!category}
				close={closeDialog}
			>
				<h1 className="mb-2">Delete Category: {category.name}</h1>
				<p>Are you sure you want to delete this category?</p>
			</Dialog>
		)
	);
});

export default DeleteCategory;
