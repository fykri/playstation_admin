import api from './axios';

export const getAllConsole = async () => {
    try {
        const { data } = await api.get('/consoles');
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
        const result = await api.post('/consoles', data);
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
        const result = await api.delete(`/consoles/delete-data/${id_console}`);
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
        const result = await api.patch(`/consoles/${id_console}`, data);
        return result;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
