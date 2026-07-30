const router = require('express').Router();
const { getDashboardStat, getMonthlyIncome } = require('./service_dashboard');

router.get('/stat', async (req, res, next) => {
    try {
        const result = await getDashboardStat();
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/monthly-income', async (req, res, next) => {
    try {
        const result = await getMonthlyIncome();
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
