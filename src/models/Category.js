const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    image: { type: String },
    icon: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

module.exports = mongoose.model('Category', categorySchema);
