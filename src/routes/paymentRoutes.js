const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

router.post('/webhook', paymentController.handleWebhook);

router.use(protect);
router.post('/initialize/:orderId', paymentController.initializePayment);
router.get('/verify/:token', paymentController.verifyPayment);
router.get('/history', paymentController.getPaymentHistory);

module.exports = router;
