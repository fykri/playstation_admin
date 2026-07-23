const { validateNotEmpty } = require('../utils/validateInput');
const { selectRevenue, selectDailyIncome, selectStationRevenue } = require('./repository_report');
const getRevenue = async (period, start, end) => {
    try {
        validateNotEmpty({ period });
        const result = await selectRevenue(period, start, end);
        return result;
    } catch (error) {
        throw error;
    }
};

const getDailyIncome = async () => {
    const result = await selectDailyIncome();
    return result;
};

const getStationRevenue = async (period, start, time) => {
    try {
        validateNotEmpty({ period });
        const result = await selectStationRevenue(period, start, time);
        return result;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    getRevenue,
    getDailyIncome,
    getStationRevenue,
};
