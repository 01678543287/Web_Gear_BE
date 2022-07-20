function Success(req, res, message = 'success', data = {}, statusCode = 200) {
    response = {
        error: 0,
        data: data,
        message: message ? message : ''
    };
    return res.status(statusCode).json(response);
}
function Error(req, res, error = 1, message = '', data = {}, statusCode = 400, errorCodeDebug = 'EDEFAULT') {
    response = {
        error: error,
        codeDebug: errorCodeDebug,
        data: data,
        message: "ERROR"
        // message: message ? message : ''
    };
    return res.status(statusCode).json(response);
}

module.exports = {
    Success,
    Error
};