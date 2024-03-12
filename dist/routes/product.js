import express from "express";
import { createNewProduct, deleteSingleProduct, getAdminAllProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, updateSingleProduct, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
// route - /api/product/new
router.post("/new", adminOnly, singleUpload, createNewProduct);
// route - /api/product/latest
router.get("/latest", getLatestProducts);
// route - /api/product/categories
router.get("/categories", getAllCategories);
// route -/api/product/admin/all
router.get("/admin/all", adminOnly, getAdminAllProducts);
// route - /api/product/all
router.get("/all", getAllProducts);
// route - /api/product/:id
router
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateSingleProduct)
    .delete(adminOnly, deleteSingleProduct);
export default router;
