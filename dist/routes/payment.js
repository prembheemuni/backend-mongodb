import express from "express";
import { adminDeleteCoupan, adminGetAllCoupans, applyDisCount, createCoupon, } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
router.post("/admin/coupon/new", adminOnly, createCoupon);
router.get("/applyDiscount", applyDisCount);
router.get("/admin/coupons", adminOnly, adminGetAllCoupans);
router.delete("/admin/delete/:coupon", adminOnly, adminDeleteCoupan);
export default router;
