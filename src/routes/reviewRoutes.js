const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/product/:productId', reviewController.getProductReviews);

router.use(protect);
router.post('/product/:productId', reviewController.createReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
