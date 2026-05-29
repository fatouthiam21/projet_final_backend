const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  name: String,
  image: String,
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    couponCode: String,
    discount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
});

cartSchema.virtual('total').get(function () {
  return this.subtotal - this.discount;
});

module.exports = mongoose.model('Cart', cartSchema);
