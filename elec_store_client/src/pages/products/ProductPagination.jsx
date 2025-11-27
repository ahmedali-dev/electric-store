import React from "react";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

const ProductPagination = ({ setParams, params, getProducts, pagination }) => {
	const next = useCallback(() => {
		if (pagination?.hasNext) {
			setParams({
				...Object.fromEntries(params),
				page: pagination.page + 1,
			});
		}
	}, [getProducts.data, getProducts.refetch]);
	const prev = useCallback(() => {
		if (pagination?.hasPrev) {
			setParams({
				...Object.fromEntries(params),
				page: pagination.page - 1,
			});
		}
	}, [getProducts.data, getProducts.refetch]);

	return (
		<div className="w-full flex items-center justify-center gap-4 mt-7">
			<div className="flex items-center justify-center p-3 gap-4 shadow-md rounded bg-gray-300">
				<Button onClick={prev} disabled={!pagination?.hasPrev || getProducts.isFetching}>
					<FontAwesomeIcon icon={faArrowLeft} />
				</Button>
				<div className="text-primary shadow-md rounded p-3 text-bold text-xl bg-gray">
					{pagination?.page} / {pagination?.totalPages}
				</div>
				<Button onClick={next} disabled={!pagination?.hasNext || getProducts.isFetching}>
					<FontAwesomeIcon icon={faArrowRight} />
				</Button>
			</div>
		</div>
	);
};

export default ProductPagination;
