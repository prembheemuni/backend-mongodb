import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = () => {
    mongoose
        .connect("mongodb+srv://prem:prem014@premkumar.dkrhfa3.mongodb.net", {
        dbName: "Backend24",
    })
        .then((c) => {
        console.log(`Mongodb connected to ${c.connection.host}`);
    })
        .catch((error) => {
        console.log(error);
    });
};
export const invalidateCache = ({ product, order, admin, productId, }) => {
    if (product) {
        const productKeys = ["admin-products", "categories", "latest-products"];
        if (productId)
            productKeys.push(`product-${productId}`);
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
export const reduceProductStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const orderItem = orderItems[i];
        const product = await Product.findById(orderItem.productId);
        if (!product)
            throw new Error("Product not found");
        if (product.stock < orderItem.quantity)
            throw new Error("Required quantity is not there");
        product.stock -= orderItem.quantity;
        await product.save();
    }
};
