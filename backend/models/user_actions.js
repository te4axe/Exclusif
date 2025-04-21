import mongoose from "mongoose";

const userActionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["view", "add_to_cart", "purchase"], // يمكن إضافة المزيد من الأنواع لاحقًا
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// نموذج مخصص
const UserAction = mongoose.model("UserAction", userActionSchema);

export default UserAction;
