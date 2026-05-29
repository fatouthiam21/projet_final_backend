const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { generateOrderNumber } = require('../utils/helpers');
const { generateWhatsAppMessage } = require('../services/whatsappService');

exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod = 'paydunya', notes } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

  // Validate stock and build order items
  const orderItems = [];
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw ApiError.badRequest(`Product ${item.name} is no longer available`);
    }
    const variant = item.product.variants.find(
      (v) => v.size === item.size && v.color === item.color
    );
    if (!variant || variant.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${item.product.name}`);
    }
    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url || '',
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    });
  }

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50000 ? 0 : 2500;
  const discount = cart.discount || 0;
  const total = subtotal + shippingCost - discount;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
      ...shippingAddress,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    },
    paymentMethod,
    subtotal,
    shippingCost,
    discount,
    total,
    notes,
    tracking: [{ status: 'pending', message: 'Order placed successfully' }],
  });

  // Decrement stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product._id, 'variants.size': item.size, 'variants.color': item.color },
      { $inc: { 'variants.$.stock': -item.quantity, salesCount: item.quantity } }
    );
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], discount: 0 });

  const whatsappMessage = generateWhatsAppMessage(order, req.user);

  ApiResponse.created(res, { order, whatsappMessage }, 'Order created successfully');
};

exports.getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments({ user: req.user._id }),
  ]);

  ApiResponse.paginated(res, orders, { page, limit, total, pages: Math.ceil(total / limit) });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!order) throw ApiError.notFound('Order not found');
  ApiResponse.success(res, { order });
};

// Admin controllers
exports.getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.search) {
    filter.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, orders, { page, limit, total, pages: Math.ceil(total / limit) });
};

exports.updateOrderStatus = async (req, res) => {
  const { status, message, location } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  order.orderStatus = status;
  order.tracking.push({ status, message: message || `Order ${status}`, location });

  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    order.cancelReason = req.body.cancelReason;

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, 'variants.size': item.size, 'variants.color': item.color },
        { $inc: { 'variants.$.stock': item.quantity } }
      );
    }
  }

  await order.save();
  ApiResponse.success(res, { order }, 'Order status updated');
};

exports.updatePaymentStatus = async (req, res) => {
  const { paymentStatus, transactionId } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { paymentStatus, paydunyaTransactionId: transactionId },
    { new: true }
  );
  if (!order) throw ApiError.notFound('Order not found');
  ApiResponse.success(res, { order }, 'Payment status updated');
};
