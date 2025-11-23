import * as yup from "yup";

export const CATEGORY_QUERY_KEY = ["categories"];

export const CATEGORY_NAME_VALIDATION = yup.object().shape({
	name: yup
		.string()
		.required("Category name is required")
		.max(100, "Category name must be less than 100 characters"),
});
