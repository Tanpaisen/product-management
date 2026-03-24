const Blog = require('../../models/blog.model')

//[GET] /
module.exports.index = async (req, res) => {
    const blogs = await Blog.find({deleted: false})
    console.log()
    res.render('admin/pages/blogs/index.pug', {
        pageTitle: 'Trang quản lý bài viết'
    })
}