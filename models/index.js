// Import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Category can have many products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

// Product is a member of just one category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

// Product is a member of many tags
Product.belongsToMany(Tag, {
  through: { model: ProductTag, unique: false }
});

// Tag contains many products
Tag.belongsToMany(Product, {
  through: { model: ProductTag, unique: false }
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
