const pool = require('../../database/db');
const { filterDataField } = require('../utils/filteringData');
const throwStatus = require('../utils/throwStatus');

const insertConsole = async (console_type, quantity, package, hourly_price) => {
    const result = await pool.query(
        'INSERT INTO console (console_type, quantity, package, hourly_price) VALUES ($1, $2, $3, $4)',
        [console_type, quantity, package, hourly_price],
    );
    return result;
};

const selectConsole = async () => {
    const result = await pool.query('SELECT * FROM console ORDER BY created_at DESC');
    return result;
};

const deleteData = async id_console => {
    try {
        return await pool.query('DELETE FROM console WHERE id_console = $1', [id_console]);
    } catch (error) {
        if (error.code === '23503' || error.code === '23001') {
            throwStatus(
                'console masih digunakan di station, harap hapus console yang ada di station terlebih dahulu',
                400,
            );
        }
    }
};

const updateConsole = async (id_console, data) => {
    try {
        const qty = await pool.query('select count (*) as count FROM station where id_console=$1', [id_console]);
        const { quantity } = data;
        if(Number(qty.rows[0].count) > quantity) {
            throwStatus('kuantitas tidak bisa di update, console masih digunakan oleh station', 400)
        }
        const { keys, values, setQuery } = filterDataField(data, [
            'console_type',
            'quantity',
            'package',
            'hourly_price',
        ]);
        return await pool.query(`UPDATE console SET ${setQuery} WHERE id_console = $${keys.length + 1} RETURNING *`, [
            ...values,
            id_console,
        ]);
    } catch (error) {
        throw error;
    }
};

const findConsole = async id_console => {
    const result = await pool.query('SELECT id_console FROM console WHERE id_console = $1', [id_console]);
    return result.rowCount;
};

module.exports = { insertConsole, selectConsole, deleteData, updateConsole, findConsole };
