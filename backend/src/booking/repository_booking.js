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
            "SELECT b.id_booking, b.id_station, s.name_station ,b.customer_name, b.booking_start, b.booking_end, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date FROM booking b INNER JOIN station s ON b.id_station = s.id_station WHERE b.status = 'booking' ORDER BY b.created_at DESC",
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
            "SELECT b.id_booking, b.id_station, s.name_station, b.customer_name, b.booking_start::time, b.booking_end::time, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date, b.status, b.number_phone from booking b INNER JOIN station s ON b.id_station = s.id_station INNER JOIN console c ON c.id_console = s.id_console WHERE b.status IN ('booking', 'playing')  ORDER BY b.created_at DESC",
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

const selectBookingWithDate = async (year, month) => {
    try {
        const result = await pool.query(
            "SELECT b.id_booking, b.id_station, s.name_station, b.customer_name, b.booking_start::time, b.booking_end::time, TO_CHAR(b.booking_date, 'YYYY-MM-DD') as booking_date, b.status, b.number_phone from booking b INNER JOIN station s ON b.id_station = s.id_station INNER JOIN console c ON c.id_console = s.id_console WHERE b.created_at >= $1 AND b.created_at < $2 ORDER BY b.created_at DESC",
            [year, month],
        );
        if (result.rowCount === 0) throwStatus('Data not found', 404);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const upsertBooking = async (id_station, time) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1) Update booking -> playing
        const bookingUpdate = await client.query(
            "UPDATE booking SET status='playing' WHERE id_station=$1 AND status='booking' RETURNING *",
            [id_station],
        );

        if (bookingUpdate.rowCount === 0) {
            throwStatus('Booking aktif untuk station ini tidak ditemukan', 404);
        }

        // 2) Update station -> used, billing = time
        const stationUpdate = await client.query(
            "UPDATE station SET status='used', billing=$1 WHERE id_station=$2 RETURNING *",
            [time, id_station],
        );

        if (stationUpdate.rowCount === 0) {
            throwStatus('Station tidak ditemukan', 404);
        }

        // 3) Tambahkan data session dengan id_station & time
        const intervalString = `${time} hour`;

        // Ambil hourly_price
        const priceQuery = await client.query(
            `SELECT c.hourly_price
       FROM station s
       JOIN console c ON s.id_console = c.id_console
       WHERE s.id_station = $1`,
            [id_station],
        );

        if (priceQuery.rowCount === 0) {
            throwStatus('station atau console tidak ditemukan', 404);
        }

        const total_price = Number(priceQuery.rows[0].hourly_price) * Number(time);

        const sessionInsert = await client.query(
            `INSERT INTO session (id_station, start_time, end_time, total_price, total_billing)
       VALUES ($1, NOW(), NOW() + $2::INTERVAL, $3, $4)
       RETURNING *`,
            [id_station, intervalString, total_price, time],
        );

        if (sessionInsert.rowCount === 0) {
            throwStatus('gagal menambahkan session', 400);
        }

        await client.query('COMMIT');

        return {
            id_station,
            time: Number(time),
            booking: bookingUpdate.rows[0],
            station: stationUpdate.rows[0],
            session: sessionInsert.rows[0],
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
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
    selectBookingWithDate,
    upsertBooking,
    checkCrash
};
