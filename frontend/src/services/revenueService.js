import axios from 'axios';

const API_URL = 'http://localhost:5000/api/revenue';

export const getRevenueReport = async (year, month) => {
    try {
        const response = await axios.get(`${API_URL}/report`, {
            params: { year, month }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy báo cáo doanh thu:', error);
        throw error;
    }
};
