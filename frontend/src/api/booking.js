import api from './axios';
export const postBooking = async data => {
    try {
        const result = await api.post('/booking', data);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getBookingActive = async () => {
    try {
        const result = await api.get('/booking/booking-active');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getBookingTableActive = async () => {
    try {
        const result = await api.get('/booking/booking-table-active');
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getBookingById = async id_booking => {
    try {
        const result = await api.get(`/booking/booking-detail/${id_booking}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const updateBookingExpired = async id_booking => {
    try {
        const result = await api.patch(`/booking/expired/${id_booking}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const updateDataBooking = async (id_booking, data) => {
    try {
        const result = await api.patch(`/booking/${id_booking}`, data);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const cancelBooking = async id_booking => {
    try {
        const result = await api.delete(`/booking/${id_booking}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};

export const getWithDate = async (year, month) => {
    try {
        const result = await api.get('booking/filter-date', {
            params: {
                year: year,
                month: month,
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

export const playBooking = async (id_station, time) => {
    try {
        const result = await api.post('/booking/play-booking', {
            id_station: id_station,
            time: time,
        });
        return result
    } catch (error) {
        if (error.response && error.response.data) {
            throw error.response.data || 'Terjadi kesalahan';
        } else {
            throw error;
        }
    }
};
