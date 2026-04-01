const throwStatus = require("../utils/throwStatus");
const {
    validateNotEmpty,
    validateInputNumber,
    isUUID,
} = require("../utils/validateInput");
const {
    insertConsole,
    selectConsole,
    deleteData,
    updateConsole,
} = require("./repository_console");
const addConsole = async ({
    console_type,
    quantity,
    package,
    hourly_price,
}) => {
    try {
        validateNotEmpty({ console_type, quantity, package, hourly_price });
        validateInputNumber({ quantity, hourly_price });
        return await insertConsole(
            console_type,
            quantity,
            package,
            hourly_price,
        );
    } catch (error) {
        throw error;
    }
};

const getConsoleData = async () => {
    try {
        const result = await selectConsole();
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const deleteConsole = async (id_console) => {
    try {
        isUUID(id_console);
        const result = await deleteData(id_console);
        if (result.rowCount === 0) {
            throwStatus("id not found", 404);
        }
    } catch (error) {
        throw error;
    }
};

const updateDataConsole = async (id_console, data) => {
    try {
        validateNotEmpty(data);
        if (data.quantity) {
            validateInputNumber({
                quantity: data.quantity,
            });
        }
        if (data.hourly_price) {
            validateInputNumber({
                hourly_price: data.hourly_price,
            });
        }
        const result = await updateConsole(id_console, data);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addConsole,
    getConsoleData,
    deleteConsole,
    updateDataConsole,
};
