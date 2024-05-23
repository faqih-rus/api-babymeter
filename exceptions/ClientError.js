class ClientError extends Error {
    constructor(message, errorCode){
        super(message);
        this.errorCode = errorCode;
        this.status = 400;
        this.name = 'ClientError';
    }
} 

module.exports = ClientError;