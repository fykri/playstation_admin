const { validateNotEmpty } = require('../utils/validateInput');
const { selectRevenue } = require('./repository_report');
const getRevenue = async (period) => {
    try {
        validateNotEmpty({ period});
        const result = await selectRevenue(period);
        return result
    } catch (error) {
        throw error
    }
};

module.exports = {
    getRevenue,
};
