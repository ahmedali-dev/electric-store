import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import Dialog from "../../components/Dialog";
import Form from "../../components/form/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect } from "react";
import { ToastHandler } from "../../utils/ToastHandler";
const validationSchema = yup.object().shape({
	name: yup.string().required("Product name is required"),
	quantity: yup.number().required("Price is required"),
});
const EditProduct = React.forwardRef(({ axiosPrivate, ...props }, ref) => {
	const [isOpen, setIsOpen] = React.useState(null);
	const axios = useAxiosPrivate();
	const queryClient = useQueryClient();
	const formik = useFormik({
		initialValues: {
			name: "",
			quantity: 0,
		},
		validationSchema,
		onSubmit: (values, action) => {
			editProduct.mutate(values);
		},
	});

	const product = useQuery({
		queryKey: ["product", isOpen],
		queryFn: async () => (await axios.get(`/products/${isOpen}`)).data?.data,
		enabled: !!isOpen,
	});

	const editProduct = useMutation({
		mutationKey: ["product", isOpen],
		mutationFn: async (data) => (await axios.patch(`/products/${isOpen}`, data)).data,
		onSuccess: (data) => {
			console.log(data);
			formik.setSubmitting(false);
			formik.resetForm();
			closeDialog();
			ToastHandler({ data: { data: { message: data.message } } });
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (error) => {
			formik.setSubmitting(false);
			ToastHandler({ error });
		},
	});

	const openDialog = React.useCallback((id) => setIsOpen((prev) => id), []);
	const closeDialog = React.useCallback(() => setIsOpen((prev) => null), []);
	const action = React.useCallback((handler) => {
		formik.submitForm();
	}, []);
	React.useImperativeHandle(
		ref,
		() => ({
			openDialog,
			closeDialog,
			action,
		}),
		[isOpen]
	);

	useEffect(() => {
		if (product.isSuccess) {
			const data = product.data;
			formik.setValues({
				name: data.name || "",
				quantity: data.quantity || 0,
			});
		}
	}, [product.isSuccess]);

	return (
		<>
			{isOpen && (
				<Dialog
					isSubmitting={formik.isSubmitting}
					open={isOpen}
					close={closeDialog}
					loading={product.isLoading || product.isPending || product.isFetching}
					action={action}
					type="submit"
				>
					<Form onSubmit={formik.handleSubmit}>
						<Form.input_group>
							<Form.input
								label="Product Name"
								name="name"
								formik={formik}
								placeholder="Enter product name"
							/>
						</Form.input_group>
						<Form.input_group>
							<Form.input
								label="Quantity"
								name="quantity"
								type="number"
								formik={formik}
								placeholder="Enter product quantity"
							/>
						</Form.input_group>
					</Form>
				</Dialog>
			)}
		</>
	);
});

export default EditProduct;
