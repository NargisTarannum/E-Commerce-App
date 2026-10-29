import mongoose from "mongoose";

// Products live in the external catalog API, so each item stores a small
// snapshot (shown if the API is unreachable). Live price/stock is re-fetched on read.
const ItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true, maxlength: 200 },
    category: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    image: { type: String, default: null },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WishlistSchema = new mongoose.Schema(
  {
    // One wishlist per user; the unique index prevents duplicate documents.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [ItemSchema], default: [] },
  },
  { timestamps: true, collection: "wishlists" }
);

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
