import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState, forwardRef, useImperativeHandle } from "react";
import Dialog from "../../components/Dialog";
import Form from "../../components/form/form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";
import { CATEGORY_QUERY_KEY, CATEGORY_NAME_VALIDATION } from "./constants";

const AddCategory = forwardRef((props, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const axios = useAxiosPrivate();

	const formik = useFormik({
		initialValues: { name: "" },
		validationSchema: CATEGORY_NAME_VALIDATION,
		onSubmit: () => {}, // Formik submission handled by mutation
	});

	const addMutation = useMutation({
		mutationKey: CATEGORY_QUERY_KEY,
		mutationFn: (name) => axios.post("categories", { name }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(CATEGORY_QUERY_KEY);
			ToastHandler({ data });
			closeDialog();
		},
		onError: (error) => {
			ToastHandler({ error });
			formik.setSubmitting(false);
		},
	});

	const openDialog = () => {
		setIsOpen(true);
	};

	const closeDialog = () => {
		formik.resetForm();
		setIsOpen(false);
	};

	const handleSubmit = () => {
		if (Object.keys(formik.errors).length === 0) {
			formik.setSubmitting(true);
			addMutation.mutate(formik.values.name);
		}
	};

	useImperativeHandle(ref, () => ({
		openDialog,
	}));

	return (
		isOpen && (
			<Dialog
				isSubmitting={formik.isSubmitting}
				type="submit"
				open={isOpen}
				action={handleSubmit}
				close={closeDialog}
			>
				<Form onSubmit={formik.handleSubmit} style="mb-4 !shadow-none">
					<Form.input_group style="text-start">
						<Form.input
							label="name"
							name="name"
							placeholder="Category name"
							formik={formik}
						/>
					</Form.input_group>
				</Form>
			</Dialog>
		)
	);
});

export default AddCategory;
