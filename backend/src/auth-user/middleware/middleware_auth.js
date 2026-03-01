const jwt = require("jsonwebtoken");
const throwStatus = require("../../utils/throwStatus");

const verifyToken = (req, res, next) => {
    try {
        const authHeader =
            req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader) throwStatus("Authorization header missing", 401);

        const token = authHeader.split(" ")[1];
        if (!token) throwStatus("Token not provided", 401);

        //const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                // Handle error spesifik
                if (err.name === "TokenExpiredError") {
                    throwStatus("Token expired", 401);
                } else if (err.name === "JsonWebTokenError") {
                    throwStatus("Invalid token", 401);
                } else {
                    throwStatus("Unauthorized", 401);
                }
            }

            req.user = {
                id: decoded.user_id,
                username: decoded.username,
            };
            next();
        });
    } catch (err) {
        next(err);
    }
};

module.exports = verifyToken;
