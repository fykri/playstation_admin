import axiosInstance from "./axiosInterceptor";
export const getEndTime = async id_station => {
    try {
        const { data } = await axiosInstance.get(`/session/time/${id_station}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const cancelledStation = async id_station => {
    try {
        const { data } = await axiosInstance.patch(`/session/${id_station}/stop`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const addBilling = async (id_station, time) => {
    try {
        const result = await axiosInstance.patch(`/session/add-billing/${id_station}`, { additionalHours: time });
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const filterSession = async (periode, status) => {
    try {
        const result = await axiosInstance.get('/session/filter', {
            params: {
                periode: periode,
                status: status,
            },
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

export const filterSessionByRentang = async (startDate, endDate, status) => {
    try {
        const result = await axiosInstance.get('/session/filter-rentang', {
            params: {
                startDate,
                endDate,
                status,
            },
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

export const getSessionActive = async () => {
    try {
        const result = await axiosInstance.get('/session/session-playing');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
