import api from './axios';

export const getEndTime = async id_station => {
    try {
        const { data } = await api.get(`/session/time/${id_station}`);
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
        const { data } = await api.patch(`/session/${id_station}/stop`);
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
        const result = await api.patch(`/session/add-billing/${id_station}`, { additionalHours: time });
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
        const result = await api.get('/session/filter', {
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
        const result = await api.get('/session/filter-rentang', {
            params: {
                startDate,
                endDate,
                status
            }
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
        const result = await api.get('/session/session-playing');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
