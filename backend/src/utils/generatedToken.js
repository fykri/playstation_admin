const jwt = require("jsonwebtoken");
const generatedToken = async (userId, username) => {
    const accessToken = await jwt.sign(
        { userId, username },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "15m",
        },
    );
    const refreshToken = await jwt.sign(
        { userId, username },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: "7d",
        },
    );
    return { accessToken, refreshToken };
};

module.exports = generatedToken