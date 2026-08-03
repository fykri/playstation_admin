const jwt = require("jsonwebtoken");
const throwStatus = require("../../utils/throwStatus");

const verifyToken = (req, res, next) => {
    console.log('req.headers.authorization: ', req.headers.authorization)
    const authHeader =
        req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return next(throwStatus("Authorization header missing", 401));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(throwStatus("Token not provided", 401));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return next(throwStatus("Token expired", 401));
            }

            if (err.name === "JsonWebTokenError") {
                return next(throwStatus("Invalid token", 401));
            }

            return next(throwStatus("Unauthorized", 401));
        }

        req.user = {
            id: decoded.user_id,
            username: decoded.username,
        };

        next();
    });
};

module.exports = verifyToken;