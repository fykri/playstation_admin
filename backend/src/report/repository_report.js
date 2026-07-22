const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');

const selectRevenue = async period => {
    try {
        let where = `status = 'finished'`;

        switch (period) {
            case 'today':
                where += `
            AND start_time >= CURRENT_DATE
            AND start_time < CURRENT_DATE + INTERVAL '1 day'
        `;
                break;

            case 'week':
                where += `
            AND start_time >= date_trunc('week', CURRENT_DATE)
            AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
        `;
                break;

            case 'month':
                where += `
            AND start_time >= date_trunc('month', CURRENT_DATE)
            AND start_time < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
        `;
                break;

            case 'custom':
                where += `
            AND start_time BETWEEN $1 AND $2
        `;
                break;
        }

        const query = `
            SELECT COALESCE(SUM(total_price), 0) AS total_revenue
            FROM session
            WHERE ${where}
        `;
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    selectRevenue,
};
