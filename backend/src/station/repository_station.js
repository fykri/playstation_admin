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
    return await pool.query('SELECT * FROM station');
};

const updateStation = async (id_station, data) => {
    try {
        const { keys, values, setQuery } = filterDataField(data, ['id_console', 'name_station', 'status']);
        return await pool.query(`UPDATE station SET ${setQuery} WHERE id_station = $${keys.length + 1} RETURNING *`, [
            ...values,
            id_station,
        ]);
    } catch (error) {
        if (error.code == '23505') {
            throw new Error('Data sudah ada (duplicate)');
        }
        throw error;
    }
};

const deleteStation = async id_station => {
    return await pool.query('DELETE FROM station WHERE id_station = $1', [id_station]);
};

module.exports = { insertStation, selectAllStation, updateStation, deleteStation };
