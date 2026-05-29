const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/my-orders/:id', orderController.getOrder);

router.use(restrictTo('admin'));
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/payment', orderController.updatePaymentStatus);

module.exports = router;
