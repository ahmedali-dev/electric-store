import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import Product from "./Product";
import ProductPagination from "./ProductPagination";
import { useMemo } from "react";
import ProductSearch from "./ProductSearch";
import { useCallback } from "react";
import AddProduct from "./AddProduct";

const Products = () => {
	const location = useLocation();
	const query = new URLSearchParams(location.search);

	const [params, setParams] = useSearchParams();
	const page = parseInt(params.get("page")) || 1;
	const id = query.get("id") || "";
	const sort = query.get("s") || "desc";
	const name = query.get("name") || "";
	const axios = useAxiosPrivate();
	const getProducts = useQuery({
		queryKey: ["products", page, id, sort],
		queryFn: async () => {
			const params = new URLSearchParams();
			params.append("s", sort);
			params.append("page", page);
			if (id) params.append("id", id);
			if (name) params.append("name", name);
			const res = await axios.get(`products?${params}`);
			return res.data;
		},
		staleTime: 10 * 60 * 1000, // 5 minutes
	});

	const searchHandle = useCallback((name) => {
		setParams((prev) => {
			prev.set("name", name);
			return prev;
		});
		getProducts.refetch();
	}, []);

	const { products, pagination } = useMemo(() => {
		return getProducts.data?.data || { products: [], pagination: null };
	}, [getProducts.data]);

	if (getProducts.isPending) {
		return <Spinner size={50} fullAndCenter={true} />;
	}
	return (
		<>
			<div className="p-3">
				{/* search */}
				<ProductSearch searchHandle={searchHandle} />

				{/* addButton and refresh button */}
				<AddProduct getProducts={getProducts} />
				{/* product List */}
				<Product
					setParams={setParams}
					params={params}
					getProducts={getProducts}
					data={products}
					loading={getProducts.isFetching}
				/>

				{/* pagination */}
				<ProductPagination
					setParams={setParams}
					getProducts={getProducts}
					pagination={pagination}
					params={params}
				/>
			</div>
		</>
	);
};

export default Products;
