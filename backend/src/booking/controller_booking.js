const router = require('express').Router();
const {
    addBooking,
    getBookingActive,
    getBookingForTable,
    getBookingById,
    updateBookingExpired,
    updateBooking,
    cancelBooking,
    getBookingWithDate,
    playBooking,
} = require('./services_booking');
router.post('/', async (req, res, next) => {
    try {
        const { id_station, customer_name, number_phone, booking_date, booking_start, duration } = req.body;

        await addBooking(id_station, customer_name, number_phone, booking_date, booking_start, duration);
        res.status(200).json({
            success: true,
            message: 'berhasil booking',
        });
    } catch (error) {
        next(error);
    }
});

router.get('/booking-active', async (req, res, next) => {
    try {
        const result = await getBookingActive();
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/booking-active-update/:id_booking', async (req, res, next) => {
    try {
        const { id_booking } = req.params;
        const result = await getBookingActiveInUpdate(id_booking);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/booking-table-active', async (req, res, next) => {
    try {
        const result = await getBookingForTable();
        res.status(200).json({
            message: 'berhasil mendapatkan data',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/booking-detail/:id_booking', async (req, res, next) => {
    try {
        const { id_booking } = req.params;
        const result = await getBookingById(id_booking);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/expired/:id_booking', async (req, res, next) => {
    try {
        const { id_booking } = req.params;
        const result = await updateBookingExpired(id_booking);
        res.status(200).json({
            success: true,
            message: 'berhasil update',
        });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id_booking', async (req, res, next) => {
    try {
        const { id_booking } = req.params;
        const { id_station, customer_name, number_phone, booking_date, booking_start, duration } = req.body;
        await updateBooking(id_booking, id_station, customer_name, number_phone, booking_date, booking_start, duration);
        res.status(200).json({
            success: true,
            message: 'berhasil update booking',
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id_booking', async (req, res, next) => {
    try {
        const { id_booking } = req.params;
        await cancelBooking(id_booking);
        res.status(200).json({
            success: true,
            message: 'berhasil cancel booking',
        });
    } catch (error) {
        next(error);
    }
});

router.get('/filter-date', async (req, res, next) => {
    try {
        const { year, month } = req.query;
        const result = await getBookingWithDate(year, month);
        res.status(200).json({
            success: true,
            message: 'berhasil mendapatkan data',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/play-booking', async (req, res, next) => {
    try {
        const { id_station, time } = req.body;
        console.log('req body: ', req.body);
        const result = await playBooking(id_station, time);
        res.status(200).json({
            success: true,
            message: 'booking berhasil di mulai, cek station buat info lebih lanjut',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
