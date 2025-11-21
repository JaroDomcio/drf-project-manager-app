import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:8000/api/';


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// MECHANIZM KOLEJKI I ODŚWIEŻANIA TOKENA
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};


// Interceptor Żądań 
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken'); //
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// Interceptor Odpowiedzi (Obsługa 401 i odświeżanie)
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        
        if (error.response?.status !== 401 || originalRequest.url.includes('token/refresh/')) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return apiClient(originalRequest); 
            }).catch(err => {
                return Promise.reject(err);
            });
        }
        
        isRefreshing = true;
        
        const refreshToken = localStorage.getItem('refreshToken'); //
        
        if (!refreshToken) {
            isRefreshing = false;
            window.location.href = '/login'
            return Promise.reject(error);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
                refresh: refreshToken,
            });

            const { access: newAccessToken, refresh: newRefreshToken } = response.data;

            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken); 
            
            return apiClient(originalRequest); 
        } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login'
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;