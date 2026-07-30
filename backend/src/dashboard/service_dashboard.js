const { selectDashboardStat, selectMonthlyIncome } = require('./repository_dashboard');

const getDashboardStat = async () => {
    try {
        const result = await selectDashboardStat();
        return {
            total_station: Number(result.rows[0].total_station),
            station_aktif: Number(result.rows[0].station_aktif),
            booking_aktif: Number(result.rows[0].booking_aktif),
            session_hari_ini: Number(result.rows[0].session_hari_ini),
            pendapatan_hari_ini: Number(result.rows[0].pendapatan_hari_ini),
        };
    } catch (error) {
        throw error;
    }
};

const getMonthlyIncome = async () => {
    const result = await selectMonthlyIncome();
    return result;
};

module.exports = { getDashboardStat, getMonthlyIncome };
