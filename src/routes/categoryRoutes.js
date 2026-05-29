const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

router.use(protect, restrictTo('admin'));
router.post('/', categoryController.createCategory);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
