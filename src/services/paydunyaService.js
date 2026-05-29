const fetch = require('node-fetch');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');

const PAYDUNYA_BASE_URL =
  process.env.PAYDUNYA_MODE === 'live'
    ? 'https://app.paydunya.com/api/v1'
    : 'https://app.paydunya.com/sandbox-api/v1';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
  'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
  'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN,
});

exports.createPayment = async (order, user) => {
  const payload = {
    invoice: {
      items: order.items.map((item) => ({
        name: `${item.name} (${item.size}/${item.color})`,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        description: item.name,
      })),
      taxes: [],
      total_amount: order.total,
      description: `Commande ${order.orderNumber} - Urban Style`,
    },
    store: {
      name: process.env.STORE_NAME || 'Urban Style',
      tagline: 'Mode masculine premium',
      phone: process.env.STORE_PHONE,
      postal_address: 'Dakar, Sénégal',
      logo_url: `${process.env.CLIENT_URL}/logo.png`,
      website_url: process.env.CLIENT_URL,
    },
    actions: {
      cancel_url: `${process.env.CLIENT_URL}/checkout?cancelled=true`,
      return_url: `${process.env.CLIENT_URL}/orders/${order._id}?success=true`,
      callback_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/v1/payments/webhook`,
    },
    customer: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '',
    },
    custom_data: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  };

  const response = await fetch(`${PAYDUNYA_BASE_URL}/checkout-invoice/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (data.response_code !== '00') {
    console.error('[PayDunya] Error response:', JSON.stringify(data, null, 2));
    throw ApiError.badRequest(
      `PayDunya error: ${data.description || data.response_text || 'Payment initialization failed'}`
    );
  }

  await Order.findByIdAndUpdate(order._id, { paydunyaToken: data.token });

  return {
    token: data.token,
    paymentUrl: data.response_text,
    invoiceUrl: `${PAYDUNYA_BASE_URL}/checkout-invoice/confirm/${data.token}`,
  };
};

exports.verifyPayment = async (token) => {
  const response = await fetch(
    `${PAYDUNYA_BASE_URL}/checkout-invoice/confirm/${token}`,
    { headers: getHeaders() }
  );
  return response.json();
};

exports.handleWebhook = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !data.custom_data) {
      return res.status(400).json({ success: false });
    }

    const { orderId } = data.custom_data;
    const status = data.status;

    const paymentStatus = status === 'completed' ? 'paid' : status === 'cancelled' ? 'failed' : 'pending';

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus,
      paydunyaTransactionId: data.invoice?.token,
      ...(paymentStatus === 'paid' && {
        orderStatus: 'confirmed',
        $push: { tracking: { status: 'confirmed', message: 'Payment confirmed, order processing' } },
      }),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};
