import express from "express";
import {
  createNewOrder,
  deleteSingleOrder,
  getAllMyOrders,
  getAllOrdersAdmin,
  getSingleOrder,
  processSingleOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// route - /api/order/new
router.post("/new", createNewOrder);

router.get("/myorders", getAllMyOrders);

router.get("/admin/orders", adminOnly, getAllOrdersAdmin);

router
  .route("/:id")
  .get(getSingleOrder)
  .put(processSingleOrder)
  .delete(deleteSingleOrder);

export default router;
