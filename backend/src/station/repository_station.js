const pool = require('../../database/db');
const { findConsole } = require('../console/repository_console');
const { filterDataField } = require('../utils/filteringData');
const throwStatus = require('../utils/throwStatus');
const insertStation = async (id_console, name_station) => {
    try {
        const result = await findConsole(id_console);
        if (result === 0) throwStatus('konsole tidak ditemukan!', 404);
        return await pool.query('INSERT INTO station (id_console, name_station) VALUES ($1, $2)', [
            id_console,
            name_station,
        ]);
    } catch (error) {
        if (error.code == '23505') {
            throw new Error('Data sudah ada (duplicate)');
        }
        throw error;
    }
};

const selectAllStation = async () => {
    const result = await pool.query(
        'SELECT s.id_station, s.id_console, s.name_station, s.status, s.billing ,c.console_type, c.package, c.hourly_price FROM station s JOIN console c ON s.id_console = c.id_console',
    );
    if (result.rowCount === 0) throwStatus('station not found', 404);
    return result;
};

const updateStation = async (id_station, data) => {
    try {
        const { keys, values, setQuery } = filterDataField(data, ['id_console', 'name_station', 'status']);
        return await pool.query(`UPDATE station SET ${setQuery} WHERE id_station = $${keys.length + 1} RETURNING *`, [
            ...values,
            id_station,
        ]);
    } catch (error) {
        throw error;
    }
};

const deleteStation = async id_station => {
    return await pool.query('DELETE FROM station WHERE id_station = $1', [id_station]);
};

const selectALlConsoleByQty = async (id_console = []) => {
    const { rows } = await pool.query(`
    SELECT
      c.id_console,
      GREATEST(c.quantity - COALESCE(s.used_count, 0), 0) AS qty,
      c.console_type,
      c.package,
      c.hourly_price
    FROM console c
    LEFT JOIN (
      SELECT
        id_console,
        COUNT(*)::int AS used_count
      FROM station
      GROUP BY id_console
    ) s ON c.id_console = s.id_console
    ORDER BY
      (GREATEST(c.quantity - COALESCE(s.used_count, 0), 0) = 0) ASC,
      c.created_at DESC
  `);

    return rows;
};

const getConsolesWithAvailability = async (id_console = null) => {
    const { rows } = await pool.query(
        `
    SELECT *
    FROM (
      SELECT
        c.id_console,
        GREATEST(
          c.quantity
          - COALESCE(s.used_count, 0)
          + CASE
              WHEN c.id_console = $1::uuid THEN 1
              ELSE 0
            END,
          0
        ) AS qty,
        c.console_type,
        c.package,
        c.hourly_price,
        c.created_at
      FROM console c
      LEFT JOIN (
        SELECT
          id_console,
          COUNT(*)::int AS used_count
        FROM station
        GROUP BY id_console
      ) s ON c.id_console = s.id_console
    ) q
    ORDER BY
      (q.qty = 0) ASC,
      q.created_at ASC
    `,
        [id_console],
    );

    return rows;
};

const upsertStation = async (id_station, time) => {
    try {
        const start_time = new Date();
        const date = start_time.toISOString().split('T')[0];
        const end_time = new Date(start_time.getTime() + time * 60 * 60 * 1000);
        const overlap = await pool.query(
            `SELECT * FROM booking 
            WHERE id_station = $1 
            AND booking_date = $2 
            AND status = 'booking'
            AND booking_start < $4 
            AND booking_end > $3`,
            [id_station, date, start_time.toISOString(), end_time.toISOString()],
        );
        if (overlap.rowCount > 0)
            throwStatus('station bentrok dengan jadwal booking pelanggan lain, harap cek di menu booking');

        const stationResult = await pool.query(
            "UPDATE station SET status='used', billing=$1 WHERE id_station=$2 AND status='available' RETURNING *",
            [time, id_station],
        );

        if (stationResult.rowCount === 0) {
            throwStatus('Station tidak ditemukan', 404);
        }

        const priceQuery = await pool.query(
            'SELECT c.hourly_price from station s JOIN console c ON s.id_console = c.id_console WHERE s.id_station = $1',
            [id_station],
        );

        if (priceQuery.rowCount === 0) throwStatus('station atau console tidak ditemukan', 404);

        const total_price = priceQuery.rows[0].hourly_price * Number(time);
        const intervalString = `${time} hour`;
        const result = await pool.query(
            'INSERT INTO session (id_station, start_time, end_time, total_price, total_billing) VALUES ($1, NOW(), NOW() + $2::INTERVAL ,$3, $4)',
            [id_station, intervalString, total_price, time],
        );
        if (result.rowCount === 0) throwStatus('gagal', 400);
    } catch (error) {
        throw error;
    }
};

const updateStatusForFinish = async id_station => {
    try {
        const booking = await pool.query("SELECT id_booking FROM booking WHERE id_station=$1 AND status='playing'", [
            id_station,
        ]);
        if (booking.rowCount > 0) {
            await pool.query("UPDATE booking SET status='finish' WHERE id_booking=$1", [booking.rows[0].id_booking]);
        }
        const updateStation = await pool.query(
            "UPDATE station SET status = 'available' WHERE id_station = $1 RETURNING *",
            [id_station],
        );
        if (updateStation.rowCount === 0) throwStatus('gagal update station', 400);
        const updateSession = await pool.query(
            "UPDATE session SET status = 'finished' where id_station=$1 AND status='playing'",
            [id_station],
        );
        if (updateSession.rowCount === 0) throwStatus('gagal update session', 400);
        return { name_station: updateStation.rows[0].name_station };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertStation,
    selectAllStation,
    updateStation,
    deleteStation,
    selectALlConsoleByQty,
    getConsolesWithAvailability,
    upsertStation,
    updateStatusForFinish,
};
