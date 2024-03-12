class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch((error) => next(error));
};
