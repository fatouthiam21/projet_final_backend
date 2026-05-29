const User = require('../models/User');
const Cart = require('../models/Cart');
const { generateToken } = require('../middlewares/auth');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  user.password = undefined;
  ApiResponse.success(res, { token, user }, message, statusCode);
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict('Email already registered');

  const user = await User.create({ firstName, lastName, email, password, phone });
  await Cart.create({ user: user._id, items: [] });

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 201, res, 'Account created successfully');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw ApiError.badRequest('Please provide email and password');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) throw ApiError.unauthorized('Your account has been deactivated');

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images slug');
  ApiResponse.success(res, { user }, 'Profile retrieved');
};

exports.updateMe = async (req, res) => {
  const { firstName, lastName, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { firstName, lastName, phone, avatar },
    { new: true, runValidators: true }
  );
  ApiResponse.success(res, { user }, 'Profile updated');
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res, 'Password changed successfully');
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  ApiResponse.success(res, { addresses: user.addresses }, 'Address added');
};

exports.updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw ApiError.notFound('Address not found');
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  Object.assign(address, req.body);
  await user.save();
  ApiResponse.success(res, { addresses: user.addresses }, 'Address updated');
};

exports.deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  ApiResponse.success(res, { addresses: user.addresses }, 'Address deleted');
};

exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.findIndex((id) => id.toString() === productId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
    await user.save();
    ApiResponse.success(res, { wishlist: user.wishlist }, 'Removed from wishlist');
  } else {
    user.wishlist.push(productId);
    await user.save();
    ApiResponse.success(res, { wishlist: user.wishlist }, 'Added to wishlist');
  }
};
