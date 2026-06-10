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
        const result1 = await client.query(
            "UPDATE station s SET status = 'available', billing = 1 FROM session se WHERE se.id_station = s.id_station AND se.id_station=$1 AND se.status IN('playing', 'paused')",
            [id_station],
        );
        const result2 = await client.query(
            "UPDATE session SET status = 'cancel' WHERE id_station = $1 AND status IN('playing', 'paused')",
            [id_station],
        );
        if (result1.rowCount === 0 || result2.rowCount === 0) throwStatus('gagal membatalkan billing: ', 400);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.release();
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
        const additionalMillisecond = Number(additionalHours) * 60 * 60 * 1000
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

module.exports = { selectTimeSession, updateSessionForCancel, updateSessionForAddBilling };
