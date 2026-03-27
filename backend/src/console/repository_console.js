const pool = require("../../database/db");
const { filterDataField } = require("../utils/filteringData");

const insertConsole = async (console_type, quantity, package, hourly_price) => {
    const result = await pool.query(
        "INSERT INTO console (console_type, quantity, package, hourly_price) VALUES ($1, $2, $3, $4)",
        [console_type, quantity, package, hourly_price],
    );
    return result;
};

const selectConsole = async () => {
    const result = await pool.query("SELECT * FROM console");
    return result;
};

const deleteData = async (id_console) => {
    return await pool.query("DELETE FROM console WHERE id_console = $1", [
        id_console,
    ]);
};

const updateConsole = async (id_console, data) => {
    const { keys, values, setQuery } = filterDataField(data, [
        "console_type",
        "quantity",
        "package",
        "hourly_price",
    ]);
    return await pool.query(
        `UPDATE console SET ${setQuery} WHERE id_console = $${keys.length + 1} RETURNING *`,
        [...values, id_console],
    );
};

module.exports = { insertConsole, selectConsole, deleteData, updateConsole };
