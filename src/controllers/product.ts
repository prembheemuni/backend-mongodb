import { NextFunction, Request, Response } from "express";
import ErrorHandler, { TryCatch } from "../utills/utils-class.js";
import { Product } from "../models/product.js";
import {
  BaseQuery,
  newProductRequestBody,
  paramQuery,
  searchQueryParams,
  updateProductRequestBody,
} from "../types/types.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utills/features.js";

/**
 * Creates a new product.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the operation.
 */
export const createNewProduct = TryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Photo deleted successfully");
      });
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const product = await Product.create({
      name,
      price,
      stock,
      photo: photo?.path,
      category: category.toLowerCase(),
    });

    invalidateCache({ product: true, productId: String(product._id) });

    res.status(201).json({
      success: true,
      message: "Product successfully Created",
    });
  }
);

/**
 * Retrieves the latest products.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * @returns The response with the latest products.
 */
export const getLatestProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products = [];
    if (myCache.has("latest-products")) {
      products = JSON.parse(myCache.get("latest-products") as string);
    } else {
      products = await Product.find({})
        .sort({
          createdAt: -1,
        })
        .limit(5);

      myCache.set("latest-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getAllCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories = [];
    if (myCache.has("categories"))
      categories = JSON.parse(myCache.get("categories") as string);
    else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getAdminAllProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products = [];
    if (myCache.has("admin-products"))
      products = JSON.parse(myCache.get("admin-products") as string);
    else {
      products = await Product.find({});
      myCache.set("admin-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getSingleProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let product;
    if (myCache.has(`product-${req.params.id}`))
      product = JSON.parse(myCache.get(`product-${req.params.id}`) as string);
    else {
      product = await Product.findById(req.params.id);
      myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }

    if (!product) return next(new ErrorHandler("Invalid Id", 400));

    return res.status(200).json({
      success: true,
      product,
    });
  }
);

export const updateSingleProduct = TryCatch(
  async (
    req: Request<paramQuery, {}, updateProductRequestBody, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    let product = await Product.findById(id);
    if (!product) {
      if (photo)
        rm(photo?.path, () => {
          console.log("photo deleted");
        });
      return next(new ErrorHandler("Invalid Id", 400));
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    if (photo) {
      rm(product.photo, () => {
        console.log("Old photo delted");
      });

      product.photo = photo.path;
    }

    await product.save();

    invalidateCache({ product: true, productId: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  }
);

export const deleteSingleProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Invalid Id", 400));

    rm(product.photo, () => {
      console.log("Product image deleted");
    });

    await product.deleteOne();

    invalidateCache({ product: true, productId: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Product Successfully deleted",
    });
  }
);

export const getAllProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, searchQueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const baseQuery: BaseQuery = {};
    const { price, category, sort, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort == "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filterOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filterOnlyProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
