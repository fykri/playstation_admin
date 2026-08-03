import axiosInstance from './axiosInterceptor';

export const getAllConsole = async () => {
    try {
        const { data } = await axiosInstance.get('/consoles');
        return data.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const postConsole = async data => {
    try {
        const result = await axiosInstance.post('/consoles', data);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
export const deleteConsole = async id_console => {
    try {
        const result = await axiosInstance.delete(`/consoles/delete-data/${id_console}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const updateConsole = async (id_console, data) => {
    try {
        const result = await axiosInstance.patch(`/consoles/${id_console}`, data);
        return result;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
