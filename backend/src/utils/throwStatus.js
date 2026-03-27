module.exports = function throwStatus(message = 'Unknown error', status = 400) {
    const error = new Error(message);
    error.status = status;
    error.name = "CustomError";
    throw error;
};