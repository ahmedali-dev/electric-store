import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const useLocalStorage = (key, initialValues = null) => {
	const [storage, setStorage] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			if (!item) return initialValues;

			try {
				return JSON.parse(item);
			} catch (error) {
				return item;
			}
		} catch (error) {
			console.log("can't read key: ", key, error);
			return initialValues;
		}
	});

	const update = useCallback(
		(newData) => {
			try {
				const value =
					newData instanceof Function ? newData(storage) : newData;
				setStorage(value);
				window.localStorage.setItem(key, value);
			} catch (error) {
				console.error(
					`Error setting localStorage key "${key}":`,
					error
				);
			}
		},
		[key, storage]
	);

	const deleteItem = useCallback(() => {
		try {
			setStorage(initialValues);
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing localStorage key "${key}":`, error);
		}
	}, [key, storage]);

	useEffect(() => {
		function handleLocalStorageChange(e) {
			if (e.key === key && e.newValue) {
				try {
					setStorage(JSON.stringify(e.newValue));
				} catch (error) {
					console.error(
						`Error syncing localStorage key "${key}":`,
						error
					);
				}
			}
		}

		window.addEventListener("storage", handleLocalStorageChange);

		return () =>
			window.removeEventListener("storage", handleLocalStorageChange);
	}, [storage, key]);

	return { item: storage, update, deleteItem };
};

export default useLocalStorage;
