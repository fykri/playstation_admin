const throwStatus = require("./throwStatus");
const filterDataField = (data, allowedField = []) => {
    try {
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key]) => allowedField.includes(key)),
        );
        if (Object.keys(filteredData).length === 0) {
            throwStatus("Tidak ada data valid untuk diupdate", 400);
        }
        const keys = Object.keys(filteredData);
        const values = Object.values(filteredData);
        const setQuery = keys
            .map((key, index) => `${key} = $${index + 1}`)
            .join(", ");
        return {keys, values, setQuery };
    } catch (error) {
        throw error;
    }
};

module.exports = { filterDataField };
