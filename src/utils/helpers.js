const slugify = require('slugify');

const generateSlug = (text) =>
  slugify(text, { lower: true, strict: true, locale: 'fr' });

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const getPaginationData = (page, limit, total) => ({
  page: parseInt(page),
  limit: parseInt(limit),
  total,
  pages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
});

const buildProductFilter = (query) => {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = { $regex: query.brand, $options: 'i' };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.size) filter['variants.size'] = { $in: query.size.split(',') };
  if (query.color) filter['variants.color'] = { $regex: query.color, $options: 'i' };
  if (query.onSale === 'true') filter.isOnSale = true;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
    ];
  }
  return filter;
};

const buildSortQuery = (sort) => {
  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 },
    'rating': { averageRating: -1 },
    'popular': { salesCount: -1 },
  };
  return sortMap[sort] || { createdAt: -1 };
};

module.exports = { generateSlug, generateOrderNumber, getPaginationData, buildProductFilter, buildSortQuery };
