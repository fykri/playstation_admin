const throwStatus = require("../utils/throwStatus");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    insertDataUser,
    findByUsername,
    updateRefreshToken,
    findToken,
    setNullToken,
} = require("./repository_user");
const generatedToken = require("../utils/generatedToken");
const { promisify } = require("util");
const verifyJwt = promisify(jwt.verify);

const addUser = async (username, password) => {
    try {
        if (!username && !password)
            throwStatus("username or password not found", 404);
        const hashedPassword = await bycrpt.hash(password, 10);
        return await insertDataUser(username, hashedPassword);
    } catch (error) {
        throw error;
    }
};

const login = async (username, password) => {
    if (!username || !password)
        throwStatus("field username atau password masih kosong");
    try {
        const user = await findByUsername(username);
        const match = await bycrpt.compare(password, user.password);
        if (!match) throwStatus("username dan password salah", 404);
        const { accessToken, refreshToken } = await generatedToken(
            user.user_id,
            user.username,
        );
        await updateRefreshToken(refreshToken, user.user_id);
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

const getToken = async (refToken) => {
    try {
        if (!refToken) throwStatus("token tidak valid", 401);
        await verifyJwt(refToken, process.env.REFRESH_TOKEN);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            await deleteToken(token);
            throwStatus("Refresh token expired", 401);
        }
        throw error;
    }
    const refreshToken = await findToken(refToken);
    const { accessToken } = await generatedToken(
        refreshToken.user_id,
        refreshToken.username,
    );
    return accessToken;
};

const logout = async (refToken) => {
    try {
        if (!refToken) throwStatus("refresh token not found", 204);
        return await setNullToken(refToken);
    } catch (error) {
        throw error;
    }
};

module.exports = { addUser, login, getToken, logout };
