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
    return await pool.query(
        'SELECT s.id_station, s.id_console, s.name_station, s.status, c.console_type, c.package, c.hourly_price FROM station s JOIN console c ON s.id_console = c.id_console',
    );
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
    const client = await pool.connect();
    try {
        const intervalString = `${time} hour`;
        await client.query('BEGIN');
        await client.query('UPDATE station SET status=$1 WHERE id_station=$2', ['used', id_station]);

        const priceQuery = await client.query(
            'SELECT c.hourly_price from station s JOIN console c ON s.id_console = c.id_console WHERE s.id_station = $1',
            [id_station],
        );

        if (priceQuery.rowCount === 0) throwStatus('station atau console tidak ditemukan', 404);

        const total_price = priceQuery.rows[0].hourly_price * Number(time);

        await client.query(
            'INSERT INTO session (id_station, start_time, end_time, total_price) VALUES ($1, NOW(), NOW() + $2::INTERVAL ,$3)',
            [id_station, intervalString, total_price],
        );
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
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
};
