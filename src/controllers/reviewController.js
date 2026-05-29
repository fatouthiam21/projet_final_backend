const Review = require('../models/Review');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getProductReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: req.params.productId, isApproved: true }),
  ]);

  ApiResponse.paginated(res, reviews, { page, limit, total, pages: Math.ceil(total / limit) });
};

exports.createReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) throw ApiError.conflict('You have already reviewed this product');

  const purchasedOrder = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    paymentStatus: 'paid',
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!purchasedOrder,
  });

  await review.populate('user', 'firstName lastName avatar');
  ApiResponse.created(res, { review }, 'Review submitted');
};

exports.updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw ApiError.notFound('Review not found');

  Object.assign(review, req.body);
  await review.save();
  ApiResponse.success(res, { review }, 'Review updated');
};

exports.deleteReview = async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, user: req.user._id };

  const review = await Review.findOneAndDelete(filter);
  if (!review) throw ApiError.notFound('Review not found');
  ApiResponse.success(res, {}, 'Review deleted');
};
