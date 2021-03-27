module.exports.SUCCESS = (data, message) => {
    return {
        success: "yes",
        data: data,
        message: message
    }
}


module.exports.FAILURE = (message, data) => {
    return {
        success: "no",
        message: message,
        data: data
    }
}

module.exports.STATUS = {
        OK: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500
}