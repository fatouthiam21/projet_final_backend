const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { generateSlug } = require('../utils/helpers');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 });
  ApiResponse.success(res, { categories });
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;
  let category;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(id).populate('parent', 'name slug');
  } else {
    category = await Category.findOne({ slug: id }).populate('parent', 'name slug');
  }
  if (!category) throw ApiError.notFound('Category not found');
  ApiResponse.success(res, { category });
};

exports.createCategory = async (req, res) => {
  const body = { ...req.body, slug: generateSlug(req.body.name) };
  const category = await Category.create(body);
  ApiResponse.created(res, { category }, 'Category created');
};

exports.updateCategory = async (req, res) => {
  const body = { ...req.body };
  if (body.name) body.slug = generateSlug(body.name);

  const category = await Category.findByIdAndUpdate(req.params.id, body, {
    new: true, runValidators: true,
  });
  if (!category) throw ApiError.notFound('Category not found');
  ApiResponse.success(res, { category }, 'Category updated');
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  ApiResponse.success(res, {}, 'Category deleted');
};
