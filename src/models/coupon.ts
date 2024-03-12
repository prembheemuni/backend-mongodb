import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", schema);
