import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { useState } from "react";
import Form from "../../components/form/form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastHandler } from "../../utils/ToastHandler";
import DropDown from "../../components/DropDown";
import { CATEGORY_QUERY_KEY } from "../categories/constants";

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.required("Product name is required")
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name must be at most 50 characters"),
	quantity: Yup.number().required("Quantity is required").default(0),
	categoryId: Yup.string().required("Category is required"),
});

const AddProduct = ({ getProducts }) => {
	const [isOpen, setIsOpen] = useState(null);
	const axios = useAxiosPrivate();
	const formik = useFormik({
		initialValues: { name: "", quantity: 0, categoryId: "" },
		validationSchema,
		onSubmit: (values, action) => {
			values = { ...values, quantity: parseInt(values.quantity) };
			addProduct.mutate(values);
		},
	});

	const getCategories = useQuery({
		queryKey: CATEGORY_QUERY_KEY,
		queryFn: async () => (await axios.get("/categories")).data,
		enabled: !!isOpen,
	});
	const addProduct = useMutation({
		mutationKey: ["products"],
		mutationFn: async (data) => (await axios.post("/products", data)).data,
		onSuccess: (data) => {
			formik.setSubmitting(false);
			ToastHandler({ data: { data: data } });
			closeDialog();
			getProducts.refetch();
		},
		onError: (error) => {
			formik.setSubmitting(false);
			ToastHandler({ error });
		},
	});

	const handleRefresh = () => {
		getProducts.refetch();
	};

	const showDialog = () => {
		setIsOpen(true);
	};
	const closeDialog = () => {
		setIsOpen(false);
	};

	return (
		<div className="flex items-center justify-start mt-4 mb-4 gap-3">
			<Dialog
				type={"submit"}
				action={formik.handleSubmit}
				isSubmitting={formik.isSubmitting}
				close={closeDialog}
				open={isOpen}
			>
				<Form
					onSubmit={formik.handleSubmit}
					style=" !shadow-none w-full mt-4 gap-3 flex flex-col items-center justify-center"
				>
					<h1 className="font-bold text-2xl">Add New Product</h1>
					{/* Add Product Form Component */}
					<Form.input_group style="w-full">
						<Form.input name="name" placeholder="Put Name: pvc" label={"Name"} formik={formik} />
					</Form.input_group>

					<Form.input_group style="w-full">
						<Form.input name="quantity" placeholder="Put Quantity: 3" label={"Quantity"} formik={formik} />
					</Form.input_group>

					<Form.input_group style="w-full">
						<DropDown
							className={formik.errors.categoryId ? "border-red-500!" : ""}
							loading={getCategories.isFetching}
						>
							{({ isOpen, setIsOpen, setValue }) => {
								return (
									<>
										{getCategories.data?.data.map((category) => {
											return (
												<DropDown.Option
													onClick={() => {
														setIsOpen(false);
														setValue((prev) => category.name);
														formik.setFieldValue("categoryId", category.id);
													}}
													key={category.id}
												>
													{category.name}
												</DropDown.Option>
											);
										})}
									</>
								);
							}}
						</DropDown>
					</Form.input_group>
				</Form>
			</Dialog>
			<Button onClick={showDialog} className={"flex items-center justify-center gap-4"}>
				<span>Add Product</span>
				<FontAwesomeIcon icon={faAdd} />
			</Button>
			<Button loading={getProducts.isFetching} onClick={handleRefresh} className={"bg-black! p-[.7rem]!"}>
				<FontAwesomeIcon icon={faRefresh} />
			</Button>
		</div>
	);
};

export default AddProduct;
