import axiosPrivate from '../api/axios';
import { useEffect } from 'react';
import User from '../interface/User';
import getUser from '../util/getUser';

const useAxiosPrivate = () => {
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: any) => {
        let token = localStorage.getItem('accessToken');
        if (token != null && token != undefined) {
          let decoded = getUser();
          if (decoded != null && Date.now() > decoded.exp * 1000) {
            localStorage.removeItem('accessToken');
          }
        }

        config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        return config;
      },
      async (error: any) => {
        return Promise.reject(error);
      },
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
