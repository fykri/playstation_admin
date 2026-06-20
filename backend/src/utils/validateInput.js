const throwStatus = require('./throwStatus');
const validateInputNumber = data => {
    try {
        for (const [key, value] of Object.entries(data)) {
            if (!Number.isFinite(Number(value))) {
                throwStatus(`${key} harus angka valid`, 400);
            }
        }
    } catch (error) {
        throw error;
    }
};

const validateNotEmpty = data => {
    try {
        for (const [key, value] of Object.entries(data)) {
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                throwStatus(`${key} tidak boleh kosong`, 400);
            }
        }
    } catch (error) {
        throw error;
    }
};

const isUUID = value => {
    try {
        const uuid = /^[0-9a-fA-F-]{36}$/.test(value);
        if (!uuid) {
            throwStatus('ID harus UUID yang valid', 400);
        }
    } catch (error) {
        throw error;
    }
};

const isValidDate = (dateString, fieldName = 'Date') => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateString)) {
        throwStatus(400, `${fieldName} tidak valid`);
    }

    const [year, month, day] = dateString.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

    if (!valid) {
        throwStatus(400, `${fieldName} tidak valid`);
    }
};

module.exports = { validateInputNumber, validateNotEmpty, isUUID, isValidDate };
