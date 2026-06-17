const throwStatus = require('../utils/throwStatus');
const { validateNotEmpty, isUUID } = require('../utils/validateInput');
const {
    insertStation,
    updateStation,
    deleteStation,
    upsertStation,
    updateStatusForFinish,
} = require('./repository_station');

const addStation = async (id_console, name_station) => {
    try {
        validateNotEmpty({ id_console, name_station });
        isUUID(id_console);
        await insertStation(id_console, name_station);
    } catch (error) {
        throw error;
    }
};

const updateDataStation = async (id_station, data) => {
    try {
        const { id_console, name_station } = data;
        validateNotEmpty({ id_console, name_station });
        isUUID(id_station);
        return await updateStation(id_station, data);
    } catch (error) {
        throw error;
    }
};

const deleteDataStation = async id_station => {
    try {
        isUUID(id_station);
        const result = await deleteStation(id_station);
        if (result.rowCount === 0) {
            throwStatus('id not found', 404);
        }
    } catch (error) {
        throw error;
    }
};

const startStation = async (id_station, time) => {
    try {
        validateNotEmpty({ id_station, time });
        isUUID(id_station);
        if (!Number.isInteger(Number(time)) || Number(time) <= 0) {
            throwStatus('Waktu tidak valid', 400);
        }
        await upsertStation(id_station, time);
    } catch (error) {
        throw error;
    }
};

const finishStation = async id_station => {
    try {
        validateNotEmpty({ id_station });
        isUUID(id_station);
        const result = await updateStatusForFinish(id_station);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = { addStation, updateDataStation, deleteDataStation, startStation, finishStation };
