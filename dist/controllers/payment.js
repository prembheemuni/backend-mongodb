import ErrorHandler, { TryCatch } from "../utills/utils-class.js";
import { Coupon } from "../models/coupon.js";
export const createCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new ErrorHandler("Please Provide Both Values", 400));
    const newCoupon = await Coupon.create({
        coupon,
        amount,
    });
    return res.status(201).json({
        success: true,
        message: `Coupon ${newCoupon.coupon} Creaated Successfully`,
    });
});
export const applyDisCount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    const couponDetails = await Coupon.findOne({ coupon });
    if (!couponDetails)
        return next(new ErrorHandler("Invalid Coupon Id", 400));
    return res.status(200).json({
        success: true,
        amount: couponDetails.amount,
    });
});
export const adminGetAllCoupans = TryCatch(async (req, res, next) => {
    const allCoupans = await Coupon.find({});
    return res.status(200).json({
        success: true,
        allCoupans,
    });
});
export const adminDeleteCoupan = TryCatch(async (req, res, next) => {
    const { coupon } = req.params;
    const oneCoupan = await Coupon.findOne({ coupon });
    if (!oneCoupan)
        return next(new ErrorHandler("Invalid Coupon Id", 400));
    const cp = await oneCoupan.deleteOne();
    return res.status(200).json({
        success: true,
        message: `Coupon deleted Successfully`,
    });
});
