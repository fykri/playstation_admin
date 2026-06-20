const router = require('express').Router();
const {
    getTimeSession,
    cancelledStation,
    filterSessionByPeriode,
    addBillingPause,
    filterByRentang
} = require('./services_session');

router.get('/time/:id_station', async (req, res, next) => {
    try {
        const { id_station } = req.params;
        const result = await getTimeSession(id_station);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id_station/stop', async (req, res, next) => {
    try {
        const { id_station } = req.params;
        await cancelledStation(id_station);
        res.status(200).json({
            success: true,
            message: 'berhasil membatalkan billing',
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/add-billing/:id_station', async (req, res, next) => {
    try {
        const { id_station } = req.params;
        const { additionalHours } = req.body;
        await addBillingPause(id_station, additionalHours);
        res.status(200).json({
            success:true,
            message: 'berhasil tambah waktu'
        })
    } catch (error) {
        next(error);
    }
});

router.get('/filter', async(req,res,next)=> {
    const {periode, status} = req.query;
    try {
        const result = await filterSessionByPeriode(periode, status)
        res.status(200).json({
            success: true,
            message: 'data berhasil didapatkan',
            data: result
        })
    } catch (error) {
        next (error)
    }
})

router.get('/filter-rentang', async(req,res,next)=> {
    const {startDate, endDate, status} = req.query;
    try {
        const result = await filterByRentang(startDate, endDate, status)
        res.status(200).json({
            success: true,
            message: 'data berhasil didapatkan',
            data: result
        })
    } catch (error) {
        next (error)
    }
})
module.exports = router;
