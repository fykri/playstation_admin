const { selectAllStation, selectALlConsoleByQty, getConsolesWithAvailability } = require('./repository_station');
const { addStation, updateDataStation, deleteDataStation, startStation } = require('./services_station');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await selectAllStation();
        res.status(200).json({
            success: true,
            data: result.rows,
            message: 'data berhasil didapatkan',
        });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { id_console, name_station } = req.body;
        await addStation(id_console, name_station);
        res.status(200).json({
            success: true,
            message: 'data berhasil di tambahkan',
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id_station', async (req, res, next) => {
    try {
        const data = req.body;
        const { id_station } = req.params;
        await updateDataStation(id_station, data);
        res.status(200).json({
            success: true,
            message: 'data berhasil di update',
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id_station', async (req, res, next) => {
    try {
        const { id_station } = req.params;
        await deleteDataStation(id_station);
        res.status(200).json({
            success: true,
            message: 'data berhasil dihapus',
        });
    } catch (error) {
        next(error);
    }
});

router.get('/getConsoleByQty', async (req, res, next) => {
    try {
        const result = await selectALlConsoleByQty();
        res.status(200).json({
            success: true,
            message: 'data berhasil didapatkan',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/getConsolesWithAvailability/:id_console', async (req, res, next) => {
    try {
        const { id_console } = req.params;
        const result = await getConsolesWithAvailability(id_console);
        res.status(200).json({
            success: true,
            message: 'berhasil dapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/start-billing/:id_station', async (req, res, next) => {
    try {
        const { id_station } = req.params;
        const { time } = req.body;
        await startStation(id_station, time);
        res.status(201).json({
            success: true,
            message: 'berhasil upsert station & session',
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
