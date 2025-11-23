import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Spinner from "../../components/Spinner";
import Product from "./Product";
import ProductPagination from "./ProductPagination";
import { useCallback } from "react";
import { useState } from "react";
import { useMemo } from "react";

const Products = () => {
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const [params, setParams] = useSearchParams();
	const page = parseInt(params.get("page")) || 1;
	const id = query.get("id") || "";
	const sort = query.get("s") || "asc";
	const axios = useAxiosPrivate();
	const getProducts = useQuery({
		queryKey: ["products", page, id, sort],
		queryFn: async () => {
			const params = new URLSearchParams();
			params.append("s", sort);
			params.append("page", page);
			if (page) params.append("id", id);
			console.log(params);
			const res = await axios.get(`products?${params}`);
			return res.data;
		},
	});

	const { products, pagination } = useMemo(() => {
		return getProducts.data?.data || { products: [], pagination: null };
	}, [getProducts.data]);

	console.log(products, pagination);
	console.log(getProducts.data);
	if (getProducts.isPending) {
		return <Spinner size={50} fullAndCenter={true} />;
	}
	return (
		<div className="p-3">
			<Product data={products} loading={getProducts.isFetching} />

			<ProductPagination
				setParams={setParams}
				getProducts={getProducts}
				pagination={pagination}
				params={params}
			/>
		</div>
	);
};

export default Products;
