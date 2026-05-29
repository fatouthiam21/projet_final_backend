const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name images price isActive variants');

  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  ApiResponse.success(res, { cart });
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw ApiError.notFound('Product not found');

  const variant = product.variants.find(
    (v) => v.size === size && v.color.toLowerCase() === color.toLowerCase()
  );
  if (!variant) throw ApiError.badRequest('Selected variant not available');
  if (variant.stock < quantity) throw ApiError.badRequest(`Only ${variant.stock} items in stock`);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > variant.stock) throw ApiError.badRequest(`Only ${variant.stock} items available`);
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      size,
      color,
      price: product.price,
      name: product.name,
      image: product.images[0]?.url || '',
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price');
  ApiResponse.success(res, { cart }, 'Added to cart');
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  } else {
    const product = await Product.findById(item.product);
    const variant = product?.variants.find(
      (v) => v.size === item.size && v.color === item.color
    );
    if (variant && quantity > variant.stock) {
      throw ApiError.badRequest(`Only ${variant.stock} items available`);
    }
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name images price');
  ApiResponse.success(res, { cart }, 'Cart updated');
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  await cart.save();
  ApiResponse.success(res, { cart }, 'Item removed from cart');
};

exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], discount: 0 });
  ApiResponse.success(res, {}, 'Cart cleared');
};
