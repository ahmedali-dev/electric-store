import { useContext, createContext, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import * as jwt from "jwt-decode";
import { useMemo } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { useMutation } from "@tanstack/react-query";

// const AuthContext = createContext({
//     token: "",
//     decoded: {},
//     isLogin: false,
//     login: (token) => { },
//     logout: () => { }
// })

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const storage = useLocalStorage("token", null);
	const refreshTokenMutation = useMutation({
		mutationFn: async () => await axiosInstance.get("auth/refresh"),
		onSuccess: (response) => {
			const token = response?.data?.token;
			if (token) {
				storage.update(token);
			}
		},
		onError: (err) => {
			console.log("hello", err);
			storage.deleteItem();
		},
	});
	const token = storage.item;
	const decoded = useMemo(() => {
		if (!token) return null;
		try {
			return jwt.jwtDecode(storage.item ?? "");
		} catch (error) {
			console.error("Failed to decode token:", error);
			return null;
		}
	}, [token]);

	// Check if token is expired
	const isTokenExpired = useCallback(() => {
		if (!decoded?.exp) return true;
		const expiryTime = decoded.exp * 1000;
		return Date.now() > expiryTime;
	}, [decoded]);

	// check if token exist
	const isLogin = useMemo(() => {
		return !!token && !!decoded && !isTokenExpired();
	}, [decoded, token, isTokenExpired]);

	useEffect(() => {
		if (!decoded && !token) return;
		const now = Date.now();
		const expire = decoded?.exp * 1000;
		const timeUntilExpire = expire - now;
		if (timeUntilExpire <= 0) {
			refreshTokenMutation.mutate();
			return;
		}

		const timer = setTimeout(() => {
			refreshTokenMutation.mutate();
		}, timeUntilExpire);

		return () => clearTimeout(timer);
	}, [storage, token, decoded]);

	const login = useCallback(
		(newToken) => {
			storage.update(newToken);
		},
		[storage]
	);

	const logout = useCallback(() => {
		storage.deleteItem();
	}, [storage]);

	return (
		<AuthContext.Provider
			value={{ token: storage.item, decoded, login, logout, isLogin }}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
