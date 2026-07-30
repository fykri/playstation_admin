import api from './axios';
export const getDashboardStat = async () => {
    try {
        const result = await api.get('/dashboard/stat');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getMonthlyIncome = async () => {
    try {
        const result = await api.get('/dashboard/monthly-income');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
