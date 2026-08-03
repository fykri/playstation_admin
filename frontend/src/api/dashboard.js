import axiosInstance from './axiosInterceptor';

export const getDashboardStat = async () => {
    try {
        const result = await axiosInstance.get('/dashboard/stat');
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
        const result = await axiosInstance.get('/dashboard/monthly-income');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getEndTimeStation = async () => {
    try {
        const result = await axiosInstance.get('/dashboard/end-time');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getActiveBooking = async () => {
    try {
        const result = await axiosInstance.get('/dashboard/active-booking');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
