const throwStatus = require('../utils/throwStatus');
const { isUUID } = require('../utils/validateInput');
const { selectTimeSession, updateSessionForCancel, updateSessionForAddBilling } = require('./repository_session');
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

module.exports = { getTimeSession, cancelledStation, addBillingPause };
