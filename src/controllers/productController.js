const Product = require('../models/Product');
const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { generateSlug, getPaginationData, buildProductFilter, buildSortQuery } = require('../utils/helpers');

const addVirtuals = (p) => ({
  ...p,
  isInStock: p.variants?.some((v) => v.stock > 0) ?? false,
  totalStock: p.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0,
});

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Resolve category slug → ObjectId
  if (req.query.category && !req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
    const cat = await Category.findOne({ slug: req.query.category.toLowerCase() });
    if (cat) req.query.category = cat._id.toString();
    else delete req.query.category;
  }

  const filter = buildProductFilter(req.query);
  const sort = buildSortQuery(req.query.sort);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const enriched = products.map(addVirtuals);
  const pagination = getPaginationData(page, limit, total);
  ApiResponse.paginated(res, enriched, pagination);
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  ApiResponse.success(res, { products: products.map(addVirtuals) });
};

exports.getNewArrivals = async (req, res) => {
  const products = await Product.find({ isActive: true, isNewArrival: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  ApiResponse.success(res, { products: products.map(addVirtuals) });
};

exports.getOnSaleProducts = async (req, res) => {
  const products = await Product.find({ isActive: true, isOnSale: true })
    .populate('category', 'name slug')
    .sort({ discountPercentage: -1 })
    .limit(8)
    .lean();
  ApiResponse.success(res, { products: products.map(addVirtuals) });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  let query = Product.findOne({ isActive: true }).populate('category', 'name slug');

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    query = query.where('_id', id);
  } else {
    query = query.where('slug', id);
  }

  const product = await query.lean();
  if (!product) throw ApiError.notFound('Product not found');

  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4).lean();

  ApiResponse.success(res, { product: addVirtuals(product), related: related.map(addVirtuals) });
};

exports.createProduct = async (req, res) => {
  const body = req.body;
  body.slug = generateSlug(body.name);

  const existing = await Product.findOne({ slug: body.slug });
  if (existing) body.slug = `${body.slug}-${Date.now()}`;

  if (body.discountPercentage > 0) {
    body.isOnSale = true;
    body.originalPrice = body.price;
    body.price = body.price * (1 - body.discountPercentage / 100);
  }

  const product = await Product.create(body);
  await Category.findByIdAndUpdate(body.category, { $inc: { productCount: 1 } });

  ApiResponse.created(res, { product }, 'Product created');
};

exports.updateProduct = async (req, res) => {
  const body = req.body;
  if (body.name) body.slug = generateSlug(body.name);

  if (body.discountPercentage > 0) {
    body.isOnSale = true;
    if (body.originalPrice) {
      body.price = body.originalPrice * (1 - body.discountPercentage / 100);
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, body, {
    new: true, runValidators: true,
  }).populate('category', 'name slug');

  if (!product) throw ApiError.notFound('Product not found');
  ApiResponse.success(res, { product }, 'Product updated');
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  for (const img of product.images) {
    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId);
    }
  }

  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
  await product.deleteOne();
  ApiResponse.success(res, {}, 'Product deleted');
};

exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) throw ApiError.badRequest('No images uploaded');

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
    alt: req.body.alt || '',
  }));

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: images } } },
    { new: true }
  );

  if (!product) throw ApiError.notFound('Product not found');
  ApiResponse.success(res, { images: product.images }, 'Images uploaded');
};

exports.deleteImage = async (req, res) => {
  const { publicId } = req.body;
  await cloudinary.uploader.destroy(publicId);
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $pull: { images: { publicId } } },
    { new: true }
  );
  ApiResponse.success(res, { images: product.images }, 'Image deleted');
};

exports.searchProducts = async (req, res) => {
  const { q, limit = 10 } = req.query;
  if (!q) throw ApiError.badRequest('Search query required');

  const products = await Product.find({
    isActive: true,
    $text: { $search: q },
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .populate('category', 'name slug')
    .lean();

  ApiResponse.success(res, { products, total: products.length });
};
