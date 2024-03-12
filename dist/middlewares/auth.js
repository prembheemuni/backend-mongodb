import ErrorHandler, { TryCatch } from "../utills/utils-class.js";
import { User } from "../models/user.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please provide Admin Id", 400));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found", 400));
    if (user.role !== "admin")
        return next(new ErrorHandler("User is not an Admin", 400));
    next();
});
