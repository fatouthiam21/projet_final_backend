const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorHex: { type: String, default: '#000000' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true, trim: true },
    images: [{ url: String, publicId: String, alt: String }],
    variants: [variantSchema],
    tags: [String],
    features: [String],
    material: String,
    care: [String],
    gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'men' },
    type: { type: String, enum: ['clothing', 'shoes', 'accessory'], required: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isOnSale: { type: Boolean, default: false },
    weight: Number,
    dimensions: { length: Number, width: Number, height: Number },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

productSchema.virtual('totalStock').get(function () {
  return (this.variants || []).reduce((acc, v) => acc + v.stock, 0);
});

productSchema.virtual('isInStock').get(function () {
  return (this.variants || []).some((v) => v.stock > 0);
});

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
