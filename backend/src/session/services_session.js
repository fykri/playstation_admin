const throwStatus = require('../utils/throwStatus');
const { isUUID, validateNotEmpty, isValidDate } = require('../utils/validateInput');
const {
    selectTimeSession,
    updateSessionForCancel,
    updateSessionForAddBilling,
    selectDataByPeriode,
    selectDataByRentang,
    selectSessionPlaying,
} = require('./repository_session');

const { formatHours } = require('../utils/formatTime');
const getTimeSession = async id_station => {
    try {
        if (!id_station || id_station === '') throwStatus('id station not found', 404);
        isUUID(id_station);
        return await selectTimeSession(id_station);
    } catch (error) {
        throw error;
    }
};

const cancelledStation = async id_station => {
    try {
        if (!id_station || id_station === '') throwStatus('id station not found', 404);
        isUUID(id_station);
        return await updateSessionForCancel(id_station);
    } catch (error) {
        throw error;
    }
};

const addBillingPause = async (id_station, additionalHours) => {
    try {
        if (!id_station || id_station === '') throwStatus('id station not found', 404);
        if (!additionalHours || !Number.isFinite(Number(additionalHours))) throwStatus('tambah waktu harus angka', 400);
        isUUID(id_station);
        return await updateSessionForAddBilling(id_station, additionalHours);
    } catch (error) {
        throw error;
    }
};

const filterSessionByPeriode = async (periode, status) => {
    try {
        validateNotEmpty({ periode, status });
        return await selectDataByPeriode(periode, status);
    } catch (error) {
        throw error;
    }
};

const filterByRentang = async (startDate, endDate, status) => {
    try {
        validateNotEmpty({ startDate, endDate, status });
        if (startDate) {
            isValidDate(startDate, 'start date');
        }
        if (endDate) {
            isValidDate(endDate, 'end date');
        }
        return await selectDataByRentang(startDate, endDate, status);
    } catch (error) {
        throw error;
    }
};

const getSessionPlaying = async ()=> {
    try {
        const result = await selectSessionPlaying()
        return result.map(val => ({
            ...val,
            start_time: formatHours(val.start_time),
            end_time: formatHours(val.end_time)
        }));
    } catch (error) {
        throw error        
    }
}

module.exports = { getTimeSession, cancelledStation, addBillingPause, filterSessionByPeriode, filterByRentang, getSessionPlaying };
