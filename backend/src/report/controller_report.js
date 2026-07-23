const router = require('express').Router();
const { getRevenue, getDailyIncome, getStationRevenue } = require('./services_report');
router.get('/revenue', async (req, res, next) => {
    try {
        const { period, start, end } = req.query;
        const result = await getRevenue(period, start, end);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/daily-income', async (req, res, next) => {
    try {
        const result = await getDailyIncome()
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/station-revenue', async(req,res,next)=> {
    try {
        const { period, start, end } = req.query;
        const result = await getStationRevenue(period, start, end);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next (error)
    }
})

module.exports = router;
