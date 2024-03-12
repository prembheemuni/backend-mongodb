import { NextFunction, Request, Response } from "express";
import ErrorHandler, { TryCatch } from "../utills/utils-class.js";
import { newOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceProductStock } from "../utills/features.js";

export const createNewOrder = TryCatch(
  async (
    req: Request<{}, {}, newOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      subtotal,
      tax,
      total,
      discount,
      orderItems,
      shippingCharges,
      user,
      status,
    } = req.body;

    if (
      !shippingInfo ||
      !subtotal ||
      !tax ||
      !total ||
      !discount ||
      !shippingCharges ||
      !user ||
      !orderItems
    )
      return next(new ErrorHandler("Please provide all details", 400));

    await reduceProductStock(orderItems);

    const order = await Order.create({
      shippingInfo,
      subtotal,
      tax,
      total,
      discount,
      shippingCharges,
      user,
      status,
      orderItems,
    });

    invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Order Placed",
    });
  }
);

export const getAllMyOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.query;
    const orders = await Order.find({ user });

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const getAllOrdersAdmin = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({});
    return res.status(200).json({
      succces: true,
      orders,
    });
  }
);

export const getSingleOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Invalid Order Id", 400));

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

export const processSingleOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Invalid Order Id", 400));

    switch (order.status) {
      case "Processing": {
        order.status = "Shipped";
        break;
      }

      case "Shipped": {
        order.status = "Delivered";
        break;
      }

      default: {
        order.status = "Delivered";
        break;
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      messsage: "Order Processed Successfully",
    });
  }
);

export const deleteSingleOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Invalid Order Id", 400));

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  }
);
