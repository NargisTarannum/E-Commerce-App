import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, select: false },
    // Accounts created before this system stored the bcrypt hash here.
    // It is migrated to passwordHash on the next successful login.
    password: { type: String, select: false },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
