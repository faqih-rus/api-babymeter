// errorHandler.js
module.exports = (request, h) => {
    const response = request.response;
    if (response.isBoom) {
        const error = response;
        const errorResponse = {
            statusCode: error.output.statusCode,
            error: error.output.payload.error,
            message: error.message
        };
        console.error('Error:', errorResponse);
        return h.response(errorResponse).code(error.output.statusCode);
    }
    return h.continue;
};
