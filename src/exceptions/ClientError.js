class ClientError extends Error {
    constructor(message, errorCode = 400) {
        super(message);
        this.errorCode = errorCode;
        this.status = 400;
        this.name = 'ClientError';
    }
}

module.exports = ClientError;
