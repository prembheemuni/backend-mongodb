import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";
import ErrorHandler, { TryCatch } from "../utills/utils-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    //return next(new ErrorHandler("payment error", 402));
    // throw new Error("What is this");
    const { name, _id, role, email, photo, dob, gender } = req.body;

    if (!name || !_id || !role || !email || !dob || !gender || !photo)
      return next(new ErrorHandler("Please provide all fields", 400));

    let user = await User.findById(_id);
    if (user)
      return res.status(201).json({
        success: true,
        message: `Welcome ${user.name}`,
      });

    user = await User.create({
      name,
      _id,
      role,
      email,
      photo,
      dob: new Date(dob),
      gender,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      users,
    });
  }
);

export const getUserById = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.find({ _id: id });

    if (user.length == 0) return next(new ErrorHandler("User not found", 400));

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUserById = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User not found", 400));

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
