// src/utils/errorHandler.js
module.exports = (request, h) => {
    const response = request.response;
    if (response.isBoom) {
        const error = response;
        const errorResponse = {
            statusCode: error.output.statusCode,
            error: error.output.payload.error,
            message: error.message
        };
        console.error('Error:', errorResponse); // Log error details
        return h.response(errorResponse).code(error.output.statusCode);
    }
    return h.continue;
};
