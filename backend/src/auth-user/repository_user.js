const pool = require("../../database/db");
const throwStatus = require("../utils/throwStatus");

const insertDataUser = async (username, password) => {
    try {
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES($1, $2)",
            [username, password],
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const findByUsername = async (username) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username=$1",
            [username],
        );
        if (!result.rows[0] || result.rows[0].length > 0)
            throwStatus("username dan password salah", 404);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const updateRefreshToken = async (refreshToken, userId) => {
    try {
        return await pool.query(
            "UPDATE users set refresh_token=$1 where user_id=$2",
            [refreshToken, userId],
        );
    } catch (error) {
        throw error;
    }
};

const findToken = async (refToken) => {
    try {
        const found = await pool.query(
            "SELECT * FROM users WHERE refresh_token=$1",
            [refToken],
        );
        if (found.rowCount === 0 ) throwStatus("forbidden", 403);
        return found.rows[0];
    } catch (error) {
        throw error;
    }
};

const setNullToken = async (refToken) => {
    try {
        await pool.query(
            "UPDATE users SET refresh_token = NULL WHERE refresh_token=$1",
            [refToken],
        );
    } catch (error) {
        throw error;
    }
};

module.exports = {
    insertDataUser,
    findByUsername,
    updateRefreshToken,
    findToken,
    setNullToken
};
