const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(protect);
router.get('/me', authController.getMe);
router.patch('/update-me', authController.updateMe);
router.patch('/change-password', authController.changePassword);
router.post('/addresses', authController.addAddress);
router.patch('/addresses/:addressId', authController.updateAddress);
router.delete('/addresses/:addressId', authController.deleteAddress);
router.post('/wishlist/:productId', authController.toggleWishlist);

module.exports = router;
