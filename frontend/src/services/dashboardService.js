import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

export const getDashboardSummary = async () => {
    try {
        const response = await axios.get(`${API_URL}/summary`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tổng quan dashboard:', error);
        throw error;
    }
};
