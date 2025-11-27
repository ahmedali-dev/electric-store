import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";
import Dialog from "../../components/Dialog";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
const DeleteProduct = forwardRef(({ ...props }, ref) => {
	const axios = useAxiosPrivate();
	const [isItemDelete, setIsItemDelete] = useState(null);
	const queryClient = useQueryClient();
	const deleteItem = useMutation({
		mutationKey: ["products"],
		mutationFn: async (id) => (await axios.delete(`/products/${id}`)).data,
		onSuccess: (data) => {
			ToastHandler({ data: { data } });
			closeDeleteDialog();
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (error) => {
			ToastHandler({ error });
			closeDeleteDialog();
		},
	});

	const showDeleteDialog = useCallback((id) => {
		console.log(id);

		setIsItemDelete(id);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setIsItemDelete(null);
	}, []);

	const handleDelete = useCallback(() => {
		if (isItemDelete) {
			deleteItem.mutate(isItemDelete);
		}
	}, [isItemDelete, deleteItem, closeDeleteDialog]);

	useImperativeHandle(ref, () => ({ showDeleteDialog }), []);
	return (
		<Dialog loading={deleteItem.isPending} open={isItemDelete} action={handleDelete} close={closeDeleteDialog}>
			<h1 className="font-bold text-xl text-primary">Delete Product</h1>
			<p>Are you sure you want to delete this product?</p>
		</Dialog>
	);
});

export default DeleteProduct;
