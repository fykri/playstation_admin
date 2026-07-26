const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');

const selectRevenue = async (period, start, end) => {

    try {
        let currentWhere = '';
        let previousWhere = '';
        const values = [];

        switch (period) {
            case 'today':
                currentWhere = `
                    start_time >= CURRENT_DATE
                    AND start_time < CURRENT_DATE + INTERVAL '1 day'
                `;

                previousWhere = `
                    start_time >= CURRENT_DATE - INTERVAL '1 day'
                    AND start_time < CURRENT_DATE
                `;
                break;

            case 'week':
                currentWhere = `
                    start_time >= date_trunc('week', CURRENT_DATE)
                    AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
                `;

                previousWhere = `
                    start_time >= date_trunc('week', CURRENT_DATE) - INTERVAL '1 week'
                    AND start_time < date_trunc('week', CURRENT_DATE)
                `;
                break;

            case 'month':
                currentWhere = `
                    start_time >= date_trunc('month', CURRENT_DATE)
                    AND start_time < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                `;

                previousWhere = `
                    start_time >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
                    AND start_time < date_trunc('month', CURRENT_DATE)
                `;
                break;

            case 'year':
                currentWhere = `
                    start_time >= date_trunc('year', CURRENT_DATE)
                    AND start_time < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
                `;

                previousWhere = `
                    start_time >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
                    AND start_time < date_trunc('year', CURRENT_DATE)
                `;
                break;

            case 'costum':
                currentWhere = `
                    start_time >= $1
                    AND start_time < $2
                `;

                values.push(start, end);
                break;

            default:
                currentWhere = 'TRUE';
                previousWhere = 'FALSE';
        }

        const query = `
            SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'finished'
                            AND ${currentWhere}
                            THEN total_price
                        END
                    ), 0
                ) AS total_pendapatan,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'finished'
                            AND ${currentWhere}
                            THEN total_billing
                        END
                    ), 0
                ) AS total_durasi,

                COUNT(
                    CASE
                        WHEN status = 'finished'
                        AND ${currentWhere}
                        THEN 1
                    END
                ) AS total_session,

                ${
                    period !== 'costum'
                        ? `
                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'finished'
                            AND ${previousWhere}
                            THEN total_price
                        END
                    ), 0
                ) AS previous_pendapatan,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'finished'
                            AND ${previousWhere}
                            THEN total_billing
                        END
                    ), 0
                ) AS previous_durasi,

                COUNT(
                    CASE
                        WHEN status = 'finished'
                        AND ${previousWhere}
                        THEN 1
                    END
                ) AS previous_session
                `
                        : `
                0 AS previous_pendapatan,
                0 AS previous_durasi,
                0 AS previous_session
                `
                }

            FROM session;
        `;

        const result = await pool.query(query, values);

        const station = await pool.query(`
            SELECT COUNT(*) AS station_aktif
            FROM station
            WHERE status = 'used'
        `);

        const data = result.rows[0];

        const calculateGrowth = (current, previous) => {
            current = Number(current);
            previous = Number(previous);

            if (previous === 0) {
                if (current === 0) return 0;
                return null;
            }

            return Number((((current - previous) / previous) * 100).toFixed(2));
        };

        return {
            total_pendapatan: Number(data.total_pendapatan),
            total_durasi: Number(data.total_durasi),
            total_session: Number(data.total_session),
            station_aktif: Number(station.rows[0].station_aktif),

            pendapatan_growth: calculateGrowth(data.total_pendapatan, data.previous_pendapatan),

            session_growth: calculateGrowth(data.total_session, data.previous_session),

            durasi_growth: calculateGrowth(data.total_durasi, data.previous_durasi),
        };
    } catch (error) {
        console.log('error: ', error)
        throw error;
    }
};

const selectDailyIncome = async () => {
    try {
        const query = `
            WITH days AS (
                SELECT generate_series(1, 7) AS day_number
            )
            SELECT
                CASE days.day_number
                    WHEN 1 THEN 'Sen'
                    WHEN 2 THEN 'Sel'
                    WHEN 3 THEN 'Rab'
                    WHEN 4 THEN 'Kam'
                    WHEN 5 THEN 'Jum'
                    WHEN 6 THEN 'Sab'
                    WHEN 7 THEN 'Min'
                END AS label,
                COALESCE(SUM(s.total_price), 0) AS total_revenue
            FROM days
            LEFT JOIN session s
                ON EXTRACT(ISODOW FROM s.start_time) = days.day_number
                AND s.status = 'finished'
                AND s.start_time >= date_trunc('week', CURRENT_DATE)
                AND s.start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
            GROUP BY days.day_number
            ORDER BY days.day_number;
        `;

        const result = await pool.query(query);

        return result.rows;
    } catch (error) {
        throw error;
    }
};

const selectStationRevenue = async (period, start, end) => {
    try {
        let where = '';
        const values = [];

        switch (period) {
            case 'today':
                where = `
                    se.start_time >= CURRENT_DATE
                    AND se.start_time < CURRENT_DATE + INTERVAL '1 day'
                `;
                break;

            case 'week':
                where = `
                    se.start_time >= date_trunc('week', CURRENT_DATE)
                    AND se.start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
                `;
                break;

            case 'month':
                where = `
                    se.start_time >= date_trunc('month', CURRENT_DATE)
                    AND se.start_time < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
                `;
                break;

            case 'year':
                where = `
                    se.start_time >= date_trunc('year', CURRENT_DATE)
                    AND se.start_time < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
                `;
                break;

            case 'custom':
                where = `
                    se.start_time >= $1
                    AND se.start_time < $2
                `;
                values.push(start, end);
                break;

            default:
                throwStatus(
                    `Periode tidak valid: ${period}. Pilihan yang tersedia adalah today, week, month, year, atau custom.`,
                );
        }

        const query = `
            SELECT
                st.name_station,
                COUNT(se.id_session) AS total_session,
                COALESCE(SUM(se.total_price), 0) AS revenue
            FROM station st
            LEFT JOIN session se
                ON st.id_station = se.id_station
                AND se.status = 'finished'
                AND ${where}
            GROUP BY
                st.id_station,
                st.name_station
            ORDER BY
                revenue DESC,
                st.name_station ASC;
        `;

        const result = await pool.query(query, values);

        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    selectRevenue,
    selectDailyIncome,
    selectStationRevenue
};
