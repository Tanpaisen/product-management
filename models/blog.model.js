const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    featuredImage: String,
    description: String,
    content: String,
    status: String,
    blog_category: String,
    views: {
        type: Number,
        default: 0,
    },
    position: Number,
    // comments: [
    //     {
    //         author: { type: String, required: true },
    //         content: { type: String, required: true },
    //         createdAt: { type: Date, default: Date.now }
    //     }
    // ],

    slug: String,
    deleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Blog = mongoose.model("Blog", blogSchema, "blogs")

module.exports = Blog;