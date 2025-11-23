import { useState, forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Dialog from "../../components/Dialog";
import Form from "../../components/form/form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";
import { CATEGORY_QUERY_KEY, CATEGORY_NAME_VALIDATION } from "./constants";

const EditCategory = forwardRef((props, ref) => {
	const [category, setCategory] = useState(null);
	const axios = useAxiosPrivate();
	const queryClient = useQueryClient();

	const formik = useFormik({
		initialValues: { name: "" },
		validationSchema: CATEGORY_NAME_VALIDATION,
		onSubmit: () => {}, // Formik submission handled by mutation
	});

	const editMutation = useMutation({
		mutationKey: CATEGORY_QUERY_KEY,
		mutationFn: ({ id, name }) => axios.patch(`categories/${id}`, { name }),
		onSuccess: (data) => {
			queryClient.invalidateQueries(CATEGORY_QUERY_KEY);
			ToastHandler({ data });
			closeDialog();
		},
		onError(error) {
			ToastHandler({ error });
			formik.setSubmitting(false);
		},
	});

	const openDialog = (cat) => {
		setCategory(cat);
		formik.setFieldValue("name", cat.name);
	};

	const closeDialog = () => {
		formik.resetForm();
		setCategory(null);
	};

	const handleEdit = () => {
		if (Object.keys(formik.errors).length === 0 && category) {
			formik.setSubmitting(true);
			editMutation.mutate({
				id: category.id,
				name: formik.values.name,
			});
		}
	};

	useImperativeHandle(ref, () => ({
		showEditDialog: openDialog,
	}));

	return (
		category && (
			<Dialog
				isSubmitting={formik.isSubmitting}
				type="submit"
				open={!!category}
				action={handleEdit}
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

export default EditCategory;
