import { NextFunction, Request, Response } from "express";

export interface newUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  gender: string;
  dob: Date;
}

export interface newProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
}

export interface updateProductRequestBody {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  photo?: string;
}

export interface paramQuery {
  id?: string;
}

export interface searchQueryParams {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export interface InvalidateCacheProps {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  productId?: string;
}

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
};

export type OrderInfoType = {
  name: string;
  photo: string;
  price: number;
  productId: string;
  quantity: number;
};

export interface newOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: OrderInfoType[];
}

export interface newCouponRequestBody {
  coupon: string;
  amount: number;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
