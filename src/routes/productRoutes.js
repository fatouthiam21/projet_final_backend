const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/on-sale', productController.getOnSaleProducts);
router.get('/:id', productController.getProduct);

router.use(protect, restrictTo('admin'));
router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/images', upload.array('images', 6), productController.uploadImages);
router.delete('/:id/images', productController.deleteImage);

module.exports = router;
