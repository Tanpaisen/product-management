const mongoose = require('mongoose')

const blogCategorySchema = new mongoose.Schema({
    title: String,
    parentId: String,
    description: String,
    featuredImage: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: "false",
    },
    
    deleteAt: Date,
    slug: {
        type: String,
        // slug: "title",
        // unique: true,
    },
}, {
    timestamps: true
})

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema, 'blogs-category');

module.exports = BlogCategory