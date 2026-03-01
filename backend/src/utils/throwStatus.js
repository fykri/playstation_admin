module.exports = function throwStatus(messsage, status = 400){
    const error = new Error(messsage)
    error.status = status
    throw error
}