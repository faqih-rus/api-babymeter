class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
        this.message = message; 
        this.status = 400; // Added a default status code for consistency
    }

    toString() {
        return `InputError: ${this.message}`;
    }
}

module.exports = InputError;
