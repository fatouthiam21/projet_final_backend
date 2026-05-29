const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect, restrictTo('admin'));
router.get('/stats', dashboardController.getStats);
router.get('/sales-chart', dashboardController.getSalesChart);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/order-status-chart', dashboardController.getOrderStatusChart);

module.exports = router;
