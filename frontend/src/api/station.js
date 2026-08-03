import axiosInstance from './axiosInterceptor';
export const getAllConsoleByQty = async () => {
    try {
        const { data } = await axiosInstance.get('/station/getConsoleByQty');
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getAllStation = async () => {
    try {
        const { data } = await axiosInstance.get('/station');
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const postDataStation = async data => {
    try {
        const result = await axiosInstance.post('/station', data);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const deleteDataStation = async id_station => {
    try {
        const result = await axiosInstance.delete(`/station/${id_station}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getConsolesWithAvailability = async id_station => {
    try {
        const { data } = await axiosInstance.get(`/station/getConsolesWithAvailability/${id_station}`);
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const updateStation = async (id_station, data) => {
    try {
        const result = await axiosInstance.patch(`/station/${id_station}`, data);
        return result;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const startbilling = async (id_station, time) => {
    try {
        const result = await axiosInstance.post(`/station/start-billing/${id_station}`, { time });
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const finishStation = async id_station => {
    try {
        const { data } = await axiosInstance.patch(`/station/finish/${id_station}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
