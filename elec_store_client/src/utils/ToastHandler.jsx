import React from "react";
import { toast } from "react-toastify";

export const ToastHandler = ({ error = null, data = null }) => {
	if (error) {
		const { success = false, message = "Unexpected Error" } =
			error?.response?.data;
		return toast.error(message);
	} else {
		const { success = true, message = "Successfully" } = data?.data;
		return toast.success(message);
	}
};
