import axiosPrivate from "../api/axios";
import { useEffect } from "react";

const useAxiosPrivate = () => {

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            async (config:any) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem("accessToken")}`;
                }
                return config;
            }, async (error) => {
                localStorage.removeItem("accessToken")
                return Promise.reject(error)
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                localStorage.removeItem("accessToken")
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [])

    return axiosPrivate;
}

export default useAxiosPrivate;