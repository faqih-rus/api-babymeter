class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
        this.message = messsage;
    }

    toString(){
        return `InputError: ${this.message}`
    }
}

module.exports = InputError;