const createError = require('http-errors');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.static(path.join(__dirname, 'public')));

//middleware
const verifyToken = require('./src/auth-user/middleware/middleware_auth');

const authUser = require('./src/auth-user/controller_user');
const consoles = require('./src/console/controller_console');
const station = require('./src/station/controller_station');
const session = require('./src/session/controller_session');
const booking = require('./src/booking/controller_booking')
const report = require('./src/report/controller_report')
app.use('/auth', authUser);
app.use('/station', station);
app.use('/consoles', consoles);
app.use('/session', session);
app.use('/booking', booking);
app.use('/report', report)

//app.get("/test", verifyToken, (req, res, next) => {
//    try {
//        res.status(200).json({
//            message: "berhasil",
//            success: true,
//        });
//    } catch (error) {
//        throw error;
//    }
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// error 404
app.use(function (req, res, next) {
    next(createError(404, 'route not found'));
});

// error handler
app.use(function (err, req, res, next) {
    console.log('err.message: ', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
