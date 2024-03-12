import express from "express";
import { deleteUserById, getAllUsers, getUserById, newUser, } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
// route - /api/v1/user/new
router.post("/new", newUser);
// route - /api/v1/user/all
router.get("/all", adminOnly, getAllUsers);
// route - /api/v1/user/id
router.route("/:id").get(getUserById).delete(adminOnly, deleteUserById);
export default router;
