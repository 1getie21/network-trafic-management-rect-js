import axios from 'axios';

const TOKEN_HEADER_KEY = 'Authorization';
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = window.sessionStorage.getItem('auth-token');
        if (token) {
            config.headers[TOKEN_HEADER_KEY] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

