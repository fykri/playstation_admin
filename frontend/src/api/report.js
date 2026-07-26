import api from './axios';

export const getRevenue = async (period, start, end) => {
    try {
        const result = await api.get('/report/revenue', {
            params: { period, start, end },
        });
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
