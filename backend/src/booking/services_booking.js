const throwStatus = require('../utils/throwStatus');
const { validateNotEmpty, isUUID, validatePhoneNumber, validateTime } = require('../utils/validateInput');
const {
    insertBooking,
    selectBookingActive,
    selectBookingForTableActive,
    selectBookingById,
    updateBookingWithStatusExpired,
    updateDataBooking,
    updateStatusCancel,
    selectBookingWithDate,
} = require('./repository_booking');
const { formatHours } = require('../utils/formatTime');
const getTimeDifference = require('../utils/getTimeDifference');

const addBooking = async (id_station, customer_name, number_phone, booking_date, booking_start, duration) => {
    try {
        isUUID(id_station);
        validateNotEmpty({
            station: id_station,
            nama_station: customer_name,
            nomor_hp: number_phone,
            tanggal_booking: booking_date,
            jam_booking: booking_start,
            durasi: duration,
        });
        const phone_number = validatePhoneNumber(number_phone);
        const bookingStart = validateTime(booking_start);
        const startDateTime = new Date(`${booking_date}T${bookingStart}:00`);
        const now = new Date();
        now.setSeconds(now.getSeconds() - 30);
        if (startDateTime <= now) {
            throwStatus('Jam Booking Sudah Lewat', 400);
        }
        const booking_end = new Date(startDateTime.getTime() + Number(duration) * 60 * 60 * 1000);
        await insertBooking(id_station, customer_name, booking_date, startDateTime, booking_end, phone_number);
    } catch (error) {
        throw error;
    }
};

const getBookingActive = async () => {
    try {
        const result = await selectBookingActive();
        return Object.values(
            result.reduce((acc, booking) => {
                const date = booking.booking_date;
                if (!acc[date]) {
                    acc[date] = {
                        id_booking: booking.id_booking,
                        booking_date: date,
                        booking: [],
                    };
                }

                acc[date].booking.push({
                    customer_name: booking.customer_name,
                    booking_start: formatHours(booking.booking_start),
                    booking_end: formatHours(booking.booking_end),
                    name_station: booking.name_station,
                });

                return acc;
            }, {}),
        );
    } catch (error) {
        throw error;
    }
};

const getBookingForTable = async () => {
    try {
        const result = await selectBookingForTableActive();
        if (result.length === 0) return [];
        return result.map(val => {
            const { hours } = getTimeDifference(val.booking_start, val.booking_end);
            return {
                id_booking: val.id_booking,
                id_station: val.id_station,
                name_station: val.name_station,
                customer_name: val.customer_name,
                booking_start: val.booking_start,
                booking_end: val.booking_end,
                booking_date: val.booking_date,
                status: val.status,
                number_phone: val.number_phone,
                billing: Number(hours),
            };
        });
    } catch (error) {
        throw error;
    }
};

const getBookingById = async id_booking => {
    try {
        validateNotEmpty({ id_booking });
        isUUID(id_booking);
        const result = await selectBookingById(id_booking);
        const { hours } = getTimeDifference(result.booking_start, result.booking_end);
        const total_price = Number(hours) * Number(result.hourly_price);
        return {
            id_booking: result.id_booking,
            name_station: result.name_station,
            customer_name: result.customer_name,
            booking_start: result.booking_start,
            booking_end: result.booking_end,
            status: result.status,
            number_phone: result.number_phone,
            booking_date: result.booking_date,
            billing: `${hours} Jam`,
            total_price: total_price,
        };
    } catch (error) {
        throw error;
    }
};

const updateBookingExpired = async id_booking => {
    try {
        isUUID(id_booking);
        return await updateBookingWithStatusExpired(id_booking);
    } catch (error) {
        throw error;
    }
};

const updateBooking = async (
    id_booking,
    id_station,
    customer_name,
    number_phone,
    booking_date,
    booking_start,
    duration,
) => {
    try {
        isUUID(id_booking);
        isUUID(id_station);
        validateNotEmpty({
            station: id_station,
            nama_station: customer_name,
            nomor_hp: number_phone,
            tanggal_booking: booking_date,
            jam_booking: booking_start,
            durasi: duration,
        });
        const phone_number = validatePhoneNumber(number_phone);
        const bookingStart = validateTime(booking_start);
        const startDateTime = new Date(`${booking_date}T${bookingStart}:00`);
        const booking_end = new Date(startDateTime.getTime() + Number(duration) * 60 * 60 * 1000);
        await updateDataBooking(
            id_booking,
            id_station,
            customer_name,
            booking_date,
            startDateTime,
            booking_end,
            phone_number,
        );
    } catch (error) {
        throw error;
    }
};

const cancelBooking = async id_booking => {
    try {
        isUUID(id_booking);
        return await updateStatusCancel(id_booking);
    } catch (error) {
        throw error;
    }
};

const getBookingWithDate = async (year, month) => {
    try {
        validateNotEmpty(year, month);
        const newMonth = parseInt(month) + 1;
        const newYear = parseInt(year);
        const beginningOfTheMonthUTC = new Date(Date.UTC(newYear, newMonth - 1, 1, 0, 0, 0)).toISOString();
        const startOfNextMonthUTC = new Date(Date.UTC(newYear, newMonth, 1, 0, 0, 0)).toISOString();

        const result = await selectBookingWithDate(beginningOfTheMonthUTC, startOfNextMonthUTC);
        return result.map(val => {
            const { hours } = getTimeDifference(val.booking_start, val.booking_end);
            return {
                id_booking: val.id_booking,
                id_station: val.id_station,
                name_station: val.name_station,
                customer_name: val.customer_name,
                booking_start: val.booking_start,
                booking_end: val.booking_end,
                booking_date: val.booking_date,
                status: val.status,
                number_phone: val.number_phone,
                billing: Number(hours),
            };
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addBooking,
    getBookingActive,
    getBookingForTable,
    getBookingById,
    updateBookingExpired,
    updateBooking,
    cancelBooking,
    getBookingWithDate,
};
