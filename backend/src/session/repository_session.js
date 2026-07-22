const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');
const selectTimeSession = async id_station => {
    try {
        const result = await pool.query(
            "SELECT start_time, end_time, total_price, status, total_billing FROM session WHERE id_station = $1 AND status IN('playing','paused') ORDER BY created_at DESC",
            [id_station],
        );
        if (result.rowCount === 0) throwStatus('data tidak ada', 404);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateSessionForCancel = async id_station => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Batalkan booking aktif jika ada
        const booking = await client.query(
            "SELECT id_booking FROM booking WHERE id_station = $1 AND status = 'playing'",
            [id_station], // Gunakan array []
        );


        if (booking.rowCount > 0) {
            await client.query("UPDATE booking SET status = 'cancel' WHERE id_booking = $1", [
                booking.rows[0].id_booking,
            ]);
        }

        // 2. Update status station
        const result1 = await client.query(
            "UPDATE station s SET status = 'available', billing = 1 FROM session se WHERE se.id_station = s.id_station AND se.id_station = $1 AND se.status IN ('playing', 'paused')",
            [id_station],
        );

        // 3. Update status session
        const result2 = await client.query(
            "UPDATE session SET status = 'cancel' WHERE id_station = $1 AND status IN ('playing', 'paused')",
            [id_station],
        );

        if (result1.rowCount === 0 || result2.rowCount === 0) {
            throwStatus('Gagal membatalkan billing: Tidak ada session aktif.', 400);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateSessionForAddBilling = async (id_station, additionalHours) => {
    try {
        const activeSession = await pool.query(
            `SELECT
        s.id_session,
        s.end_time,
        c.hourly_price,
        s.total_price,
        s.total_billing
     FROM session s
     JOIN station st ON s.id_station = st.id_station
     JOIN console c ON st.id_console = c.id_console
     WHERE s.id_station = $1
     AND s.status = 'playing'`,
            [id_station],
        );
        if (activeSession.rowCount === 0) throwStatus('Sesi aktif tidak ditemukan!', 404);
        const endTimeOld = new Date(activeSession.rows[0].end_time).getTime();
        const additionalMillisecond = Number(additionalHours) * 60 * 60 * 1000;
        const newEndTime = new Date(endTimeOld + additionalMillisecond);
        const newTotalPrice =
            activeSession.rows[0].hourly_price * Number(additionalHours) + activeSession.rows[0].total_price;
        const newTotalBilling = Number(additionalHours) + Number(activeSession.rows[0].total_billing);
        const result = await pool.query(
            'UPDATE session SET end_time=$1, total_price=$2, total_billing=$3 WHERE id_session=$4',
            [newEndTime, newTotalPrice, newTotalBilling, activeSession.rows[0].id_session],
        );
        if (result.rowCount === 0) throwStatus('gagal tambah waktu', 400);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectDataByPeriode = async (periode, status) => {
    try {
        let query =
            'SELECT se.id_session, st.name_station, se.start_time, se.end_time, se.total_billing, se.status, se.total_price FROM session se JOIN station st ON se.id_station = st.id_station WHERE 1=1';
        const values = [];

        // Filter periode
        if (periode === 'today') {
            query += ' AND se.created_at::date = CURRENT_DATE';
        } else if (periode === 'week') {
            query += " AND se.created_at >= date_trunc('week', NOW())";
        } else if (periode === 'month') {
            query += " AND se.created_at >= date_trunc('month', NOW())";
        } else if (periode === 'year') {
            query += " AND se.created_at >= date_trunc('year', NOW())";
        }

        // Filter status
        if (status && status !== 'all') {
            query += ` AND se.status = $1`;
            values.push(status);
        }

        query += ' ORDER BY se.created_at DESC';

        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error) {
        throw error;
    }
};

const selectDataByRentang = async (startDate, endDate, status) => {
    try {
        let query = `
    SELECT
        se.id_session,
        st.name_station,
        se.start_time,
        se.end_time,
        se.total_billing,
        se.status,
        se.total_price
    FROM session se
    JOIN station st ON se.id_station = st.id_station
    WHERE se.created_at::date BETWEEN $1 AND $2
`;

        const values = [startDate, endDate];

        if (status !== 'all') {
            query += ' AND se.status = $3';
            values.push(status);
        }

        query += ' ORDER BY se.created_at DESC';

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const selectSessionPlaying = async () => {
    try {
        const result = await pool.query(
            "SELECT se.id_session, se.start_time, se.end_time, st.name_station from SESSION se INNER JOIN station st ON se.id_station = st.id_station WHERE se.status='playing'",
        );
        if (result.rowCount === 0) throwStatus('tidak ada station yang aktif', 404);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    selectTimeSession,
    updateSessionForCancel,
    updateSessionForAddBilling,
    selectDataByPeriode,
    selectDataByRentang,
    selectSessionPlaying,
};
