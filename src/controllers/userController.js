const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, users, { page, limit, total, pages: Math.ceil(total / limit) });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, { user });
};

exports.updateUser = async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isActive },
    { new: true, runValidators: true }
  );
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, { user }, 'User updated');
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot delete your own account');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, {}, 'User deleted');
};
