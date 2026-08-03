import axiosInstance from "./axiosInterceptor";

export const getRevenue = async (period, start, end) => {
    try {
        const result = await axiosInstance.get('/report/revenue', {
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

export const getRevenueStation = async (period, start, end) => {
    try {
        const result = await axiosInstance.get('/report/station-revenue', {
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

export const getDailyIncome = async () => {
    try {
        const result = await axiosInstance.get('/report/daily-income');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
