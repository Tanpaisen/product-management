const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: "",
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  featured: String,
  thumbnail: String,
  status: String,
  position: Number,
  createBy: {
    user_id: String,
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  deleted: {
    type: Boolean,
    default: "false",
  },
  deletedBy: {
    user_id: String,
    deletedAt: Date,
  },
  updateBy: [
    {
      user_id: String,
      updateAt: Date,
    }
  ],
  slug: {
    type: String,
    slug: "title",
    unique: true,
  },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product;