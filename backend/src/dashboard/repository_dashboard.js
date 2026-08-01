const pool = require('../../database/db');
const throwStatus = require('../utils/throwStatus');
const selectDashboardStat = async () => {
    try {
        const query = `
            SELECT
                -- Jumlah seluruh station
                (SELECT COUNT(*)
                 FROM station) AS total_station,

                -- Station yang sedang digunakan
                (SELECT COUNT(*)
                 FROM station
                 WHERE status = 'used') AS station_aktif,

                -- Booking yang masih aktif
                (SELECT COUNT(*)
                 FROM booking
                 WHERE status = 'booking') AS booking_aktif,

                -- Session yang dimulai hari ini
                (SELECT COUNT(*)
                 FROM session
                 WHERE status = 'finished'
                 AND start_time >= CURRENT_DATE
                 AND start_time < CURRENT_DATE + INTERVAL '1 day'
                ) AS session_hari_ini,

                -- Pendapatan hari ini
                (SELECT COALESCE(SUM(total_price), 0)
                 FROM session
                 WHERE status = 'finished'
                 AND start_time >= CURRENT_DATE
                 AND start_time < CURRENT_DATE + INTERVAL '1 day'
                ) AS pendapatan_hari_ini;
        `;
        const result = await pool.query(query);
        return result;
    } catch (error) {
        throw error;
    }
};

const selectMonthlyIncome = async () => {
    try {
        const query = `WITH months AS(SELECT generate_series(1,12) AS month_number) 
            SELECT CASE months.month_number
                WHEN 1 THEN 'Januari'
                WHEN 2 THEN 'Februari'
                WHEN 3 THEN 'Maret'
                WHEN 4 THEN 'April'
                WHEN 5 THEN 'Mei'
                WHEN 6 THEN 'Juni'
                WHEN 7 THEN 'Juli'
                WHEN 8 THEN 'Agustus'
                WHEN 9 THEN 'September'
                WHEN 10 THEN 'Oktober'
                WHEN 11 THEN 'November'
                WHEN 12 THEN 'Desember'
                END AS label,

                COALESCE(SUM(s.total_price), 0) AS revenue

                FROM months LEFT JOIN session s
                ON EXTRACT(MONTH FROM s.start_time) = months.month_number
                AND EXTRACT(YEAR FROM s.start_time) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND s.status = 'finished'

                GROUP BY months.month_number
                ORDER BY months.month_number;`;

        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

const selectStationStatusPlaying = async () => {
    const result = await pool.query(
        `SELECT s.id_station,s.status, st.name_station, c.package, s.end_time FROM SESSION s INNER JOIN station st ON s.id_station = st.id_station INNER JOIN console c ON c.id_console = st.id_console WHERE s.status = 'playing'`,
    );
    if (result.rowCount === 0) throwStatus('Belum ada station yang sedang aktif saat ini.', 404);
    return result.rows;
};

const selectBookingActive = async () => {
    const result = await pool.query(
        `SELECT id_booking, booking_start::time, booking_end::time, customer_name FROM booking WHERE status IN ('booking', 'playing') AND booking_start >= CURRENT_DATE AND booking_start < CURRENT_DATE + INTERVAL '1 day'`,
    );
    if (result.rowCount === 0) throwStatus('Belum ada booking yang sedang aktif saat ini.', 404);
    return result.rows;
};

module.exports = { selectDashboardStat, selectMonthlyIncome, selectStationStatusPlaying, selectBookingActive };
