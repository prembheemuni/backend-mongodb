export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({
        success: true,
        message: err.message,
    });
};
