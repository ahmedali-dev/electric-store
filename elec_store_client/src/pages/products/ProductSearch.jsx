import Form from "../../components/form/form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
	name: Yup.string().required("Product name is required"),
});
const ProductSearch = ({ searchHandle }) => {
	const formik = useFormik({
		initialValues: { name: "" },
		validationSchema,
		onSubmit: (values, action) => {
			searchHandle(values.name);
			action.setSubmitting(false);
		},
	});
	return (
		<Form
			onSubmit={formik.handleSubmit}
			style="bg-white !shadow-none w-full mt-4 gap-3 flex items-center justify-center"
		>
			<Form.input_group style="w-full">
				<Form.input name="name" placeholder="Search in category" formik={formik} showError={false} />
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
};

export default ProductSearch;
