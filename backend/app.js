const createError = require("http-errors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const pool  = require("./config/db");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// error 404
app.use(function (req, res, next) {
    next(createError(404, "route not found"));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
