const Order = require('../models/Order');
const { createPayment, verifyPayment, handleWebhook } = require('../services/paydunyaService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.initializePayment = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentStatus === 'paid') throw ApiError.badRequest('Order already paid');

  const paymentData = await createPayment(order, req.user);
  ApiResponse.success(res, paymentData, 'Payment initialized');
};

exports.verifyPayment = async (req, res) => {
  const { token } = req.params;
  const data = await verifyPayment(token);

  if (data.status === 'completed') {
    const order = await Order.findOneAndUpdate(
      { paydunyaToken: token },
      {
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        paydunyaTransactionId: data.invoice?.token,
        $push: { tracking: { status: 'confirmed', message: 'Payment confirmed' } },
      },
      { new: true }
    );
    ApiResponse.success(res, { order, paymentStatus: 'paid' }, 'Payment verified');
  } else {
    ApiResponse.success(res, { paymentStatus: data.status }, 'Payment pending');
  }
};

exports.handleWebhook = handleWebhook;

exports.getPaymentHistory = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    paymentStatus: { $in: ['paid', 'failed'] },
  })
    .sort({ createdAt: -1 })
    .select('orderNumber total paymentStatus paydunyaTransactionId createdAt');
  ApiResponse.success(res, { orders });
};
