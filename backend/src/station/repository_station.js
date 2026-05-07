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
    return await pool.query('SELECT * FROM station s JOIN console c ON s.id_console = c.id_console');
};

const updateStation = async (id_station, data) => {
    try {
        const { keys, values, setQuery } = filterDataField(data, ['id_console', 'name_station', 'status']);
        return await pool.query(`UPDATE station SET ${setQuery} WHERE id_station = $${keys.length + 1} RETURNING *`, [
            ...values,
            id_station,
        ]);
    } catch (error) {
        throw error
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
      c.created_at ASC
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

module.exports = {
    insertStation,
    selectAllStation,
    updateStation,
    deleteStation,
    selectALlConsoleByQty,
    getConsolesWithAvailability,
};
