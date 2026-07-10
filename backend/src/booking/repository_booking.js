const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');
const { formatHours } = require('../utils/formatTime');

const checkCrash = async (payload, id_booking) => {
    const { id_station, booking_date, booking_start, booking_end } = payload;
    const query = `
        SELECT * FROM booking 
        WHERE id_station = $1 
          AND booking_date = $2
          AND ($3 < booking_end AND $4 > booking_start)
          AND ($5::UUID IS NULL OR id_booking <> $5)
          AND status='booking'
    `;
    const values = [id_station, booking_date, booking_start, booking_end, id_booking || null];
    const result = await pool.query(query, values);
    console.log(result.rows)
    return result.rowCount > 0;
};

const insertBooking = async (id_station, customer_name, booking_date, booking_start, booking_end, number_phone) => {
    try {
        const isConflict = await checkCrash({ id_station, booking_date, booking_start, booking_end }, null);
        if (isConflict) throwStatus('Jadwal bentrok dengan booking lain.', 409);

        const sessionConflict = await pool.query(
            `SELECT 1 FROM session
            WHERE id_station = $1
            AND status = 'playing'
            AND start_time < $3
            AND end_time > $2
            LIMIT 1;
    `,
            [id_station, booking_start, booking_end],
        );

        if (sessionConflict.rowCount > 0) {
            throwStatus('Station sedang digunakan pada jam tersebut.', 409);
        }

        const result = await pool.query(
            "INSERT INTO booking (id_station, customer_name, booking_start, booking_end, status, number_phone, booking_date) VALUES($1, $2, $3, $4, 'booking', $5, $6)",
            [id_station, customer_name, booking_start, booking_end, number_phone, booking_date],
        );
        if (result.rowCount === 0) throwStatus('gagal tambah data booking', 400);
    } catch (error) {
        throw error;
    }
};

const selectBookingActive = async () => {
    try {
        const result = await pool.query(
            "SELECT b.id_booking, b.id_station, s.name_station ,b.customer_name, b.booking_start, b.booking_end, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date FROM booking b INNER JOIN station s ON b.id_station = s.id_station WHERE b.status = 'booking'",
        );
        if (result.rowCount === 0) throwStatus('tidak ada booking yang aktif', 404);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const selectBookingForTableActive = async () => {
    try {
        const result = await pool.query(
            "SELECT b.id_booking, b.id_station, s.name_station, b.customer_name, b.booking_start::time, b.booking_end::time, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date, b.status, b.number_phone from booking b INNER JOIN station s ON b.id_station = s.id_station INNER JOIN console c ON c.id_console = s.id_console WHERE b.status = 'booking'",
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const selectBookingById = async id_booking => {
    try {
        const result = await pool.query(
            "SELECT b.id_booking, b.id_station, s.name_station, b.customer_name, b.booking_start::time, b.booking_end::time, b.status, b.number_phone, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date, c.hourly_price from booking b INNER JOIN station s ON b.id_station = s.id_station INNER JOIN console c ON c.id_console = s.id_console WHERE b.id_booking = $1",
            [id_booking],
        );
        if (result.rowCount === 0) throwStatus('booking tidak ditemukan', 404);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateBookingWithStatusExpired = async id_booking => {
    try {
        const result = await pool.query("UPDATE booking set status='expired' WHERE id_booking=$1", [id_booking]);
        if (result.rowCount === 0) throwStatus('tidak ada yang di update', 400);
    } catch (error) {
        throw error;
    }
};

const updateDataBooking = async (
    id_booking,
    id_station,
    customer_name,
    booking_date,
    booking_start,
    booking_end,
    number_phone,
) => {
    try {
        const isCrash = await checkCrash({ id_station, booking_date, booking_start, booking_end }, id_booking);
        if (isCrash) throwStatus('Jadwal sudah di-booking orang lain!', 400);
        const sessionConflict = await pool.query(
            `SELECT 1 FROM session
            WHERE id_station = $1
            AND status = 'playing'
            AND start_time < $3
            AND end_time > $2
            LIMIT 1;`,
            [id_station, booking_start, booking_end],
        );

        if (sessionConflict.rowCount > 0) {
            throwStatus('Station sedang digunakan pada jam tersebut.', 409);
        }

        const result = await pool.query(
            'UPDATE booking SET id_station=$1, customer_name=$2, booking_date=$3, booking_start=$4, booking_end=$5, number_phone=$6 WHERE id_booking=$7',
            [id_station, customer_name, booking_date, booking_start, booking_end, number_phone, id_booking],
        );
        if (result.rowCount === 0) throwStatus('tidak ada yang di update', 204);
    } catch (error) {
        throw error;
    }
};

const updateStatusCancel = async id_booking => {
    try {
        const result = await pool.query("UPDATE booking set status = 'cancel' WHERE id_booking=$1", [id_booking]);
        if (result.rowCount === 0) throwStatus('gagal update data', 400);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertBooking,
    selectBookingActive,
    selectBookingForTableActive,
    selectBookingById,
    updateBookingWithStatusExpired,
    updateDataBooking,
    updateStatusCancel,
};
