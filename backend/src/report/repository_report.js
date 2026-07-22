const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');

const selectRevenue = async (period, start, end) => {
    try {
        let where = '';
        const values = [];

        switch (period) {
            case 'today':
                where = `
                    start_time >= CURRENT_DATE
                    AND start_time < CURRENT_DATE + INTERVAL '1 day'
                `;
                break;

            case 'week':
                where = `
                    start_time >= date_trunc('week', CURRENT_DATE)
                    AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
                `;
                break;

            case 'month':
                where = `
                    start_time >= date_trunc('month', CURRENT_DATE)
                    AND start_time < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                `;
                break;

            case 'custom':
                where = `
                    start_time >= $1
                    AND start_time < $2
                `;
                values.push(start, end);
                break;

            default:
                where = 'TRUE';
        }

        const query = `
            SELECT
                COALESCE(SUM(CASE WHEN status = 'finished' THEN total_price END), 0) AS total_pendapatan,
                COALESCE(SUM(CASE WHEN status = 'finished' THEN total_billing END), 0) AS total_durasi,
                COUNT(*) AS total_session
            FROM session
            WHERE ${where};
        `;

        const result = await pool.query(query, values);

        const station = await pool.query(`
            SELECT COUNT(*) AS station_aktif
            FROM station
            WHERE status = 'used'
        `);

        return {
            ...result.rows[0],
            station_aktif: station.rows[0].station_aktif,
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    selectRevenue,
};
