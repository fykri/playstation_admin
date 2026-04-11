const { selectAllStation } = require('./repository_station');
const { addStation, updateDataStation, deleteDataStation } = require('./services_station');

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
        console.log(error)
        next(error)
    }
});

module.exports = router;
