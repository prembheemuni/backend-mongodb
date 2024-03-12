import express from "express";
import { connectDB } from "./utills/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import cors from "cors";
// importing routes
import userRouter from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
export const myCache = new NodeCache();
const port = 4000;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.status(200).send(`API are working user API/V1`);
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
// serving uploads folder as static to the frontend
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Express is running at http://localhost:${port}`);
});
connectDB();
