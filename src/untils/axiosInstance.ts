import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/router';

// Tạo một instance của axios với cấu hình cơ bản
const axiosInstance = axios.create({
  // baseURL: 'https://toptop-be.onrender.com/api/v1',
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Interceptor config:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response để xử lý lỗi 401 (token hết hạn)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const router = useRouter(); // Sử dụng router để chuyển hướng

    // Nếu token hết hạn (lỗi 401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // Kiểm tra nếu không có refreshToken
      if (!refreshToken) {
        message.error('No refresh token found. Please log in.');
        router.push('/login');
        return Promise.reject(error); // Ngừng thực hiện tiếp yêu cầu
      }

      try {
        // Gửi yêu cầu refresh token
        const { data } = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {
          refreshToken,
        });

        // Lưu token mới vào localStorage
        const newAccessToken = data.access_token;
        localStorage.setItem('token', newAccessToken);

        // Cập nhật header Authorization với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Thực hiện lại yêu cầu ban đầu với token mới
        return axiosInstance(originalRequest);
      } catch (err) {
        // Nếu refresh token thất bại (ví dụ: refresh token hết hạn), yêu cầu người dùng đăng nhập lại
        message.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.push('/login');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;