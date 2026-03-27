const throwStatus = require("./throwStatus");
const validateInputNumber = (data) => {
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

const validateNotEmpty = (data) => {
    try {
        for (const [key, value] of Object.entries(data)) {
            if (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            ) {
                throwStatus(`${key} tidak boleh kosong`, 400);
            }
        }
    } catch (error) {
        throw error;
    }
};

const isUUID = (value) => {
    try {
        const uuid = /^[0-9a-fA-F-]{36}$/.test(value);
        if (!uuid) {
            throwStatus("ID harus UUID yang valid", 400);
        }
    } catch (error) {
        throw error;
    }
};



module.exports = { validateInputNumber, validateNotEmpty, isUUID };
