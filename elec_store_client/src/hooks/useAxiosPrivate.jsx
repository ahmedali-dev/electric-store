import React from 'react'
import axios from './../utils/axios';
import useAuth from './useAuth';
import { useEffect } from 'react';

const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

const useAxiosPrivate = () => {
    const auth = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${auth.token}`;
            }

            return config
        }, (error) => Promise.reject(error));


        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (!error?.response) {
                    return Promise.reject(error)
                }

                if (error?.response.status == 401) {
                    prevRequest.send = true;
                    const newAccessToken = await axios.get('/auth/refresh');
                    auth.login(newAccessToken?.data?.token);
                    prevRequest.headers.Authorization = `Bearer ${newAccessToken?.data?.token}`;
                    return axiosPrivate.request(prevRequest);
                }

                return Promise.reject(error);
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth.login, auth.token]);


    return axiosPrivate;
}

export default useAxiosPrivate