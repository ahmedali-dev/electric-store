import { forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Form from "../../components/form/form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";
import { CATEGORY_QUERY_KEY, CATEGORY_NAME_VALIDATION } from "./constants";
import Button from "../../components/Button";

const SearchCategories = forwardRef((props, ref) => {
	const axios = useAxiosPrivate();
	const queryClient = useQueryClient();

	const searchMutation = useMutation({
		mutationKey: CATEGORY_QUERY_KEY,
		mutationFn: (name) => axios.post("categories/search", { name }),
		onSuccess: (data) => {
			queryClient.setQueryData(CATEGORY_QUERY_KEY, data);
			formik.setSubmitting(false);
		},
		onError(error) {
			ToastHandler({ error });
			formik.setSubmitting(false);
		},
	});

	const formik = useFormik({
		initialValues: { name: "" },
		validationSchema: CATEGORY_NAME_VALIDATION,
		onSubmit: (values) => {
			searchMutation.mutate(values.name);
		},
	});

	useImperativeHandle(ref, () => ({
		formik,
	}));

	return (
		<Form
			onSubmit={formik.handleSubmit}
			style="bg-white !shadow-none w-full mt-4 gap-3 flex items-center justify-center"
		>
			<Form.input_group style="w-full">
				<Form.input
					name="name"
					placeholder="Search in category"
					formik={formik}
					showError={false}
				/>
			</Form.input_group>

			<Form.input_group>
				<Button
					type="submit"
					loading={formik.isSubmitting}
					className="p-3! cursor-pointer text-white rounded bg-primary hover:opacity-90 disabled:opacity-50 transition"
					title="Search categories"
				>
					<FontAwesomeIcon icon={faSearch} />
				</Button>
			</Form.input_group>
		</Form>
	);
});

export default SearchCategories;
