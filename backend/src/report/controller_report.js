const router = require('express').Router();
const { getRevenue } = require('./services_report');
router.get('/revenue', async (req, res, next) => {
    try {
        const { period } = req.query;
        const result = await getRevenue(period);
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
