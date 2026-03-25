const BlogCategory = require('../../models/blog.category.model')

//[GET] admin/blogs-category/
module.exports.index = async (req, res) => {

    const blogsCategory = await BlogCategory.find({deleted: false})

    res.render('admin/pages/blogs-category/index.pug', {
        pageTitle: 'Trang quản lý danh mục bài viết',
        blogsCategory: blogsCategory,
    })
}

//[GET] admin/blogs-category/create
module.exports.create = async (req, res) => {

    res.render('admin/pages/blogs-category/create.pug', {
        pageTitle: 'Thêm mới danh mục bài viết',
    })
}

//[POST] admin/blogs-category/create
module.exports.createPost = async (req, res) => {
    try {
        if (req.body.position != "") {
            req.body.position = parseInt(req.body.position)
        }
        else {
            const countBlogCategory = await BlogCategory.countDocuments()
            req.body.position = countBlogCategory + 1
        }
        const blogsCategory = new BlogCategory(req.body)
        blogsCategory.save()

        req.flash('success', 'Thêm thành công danh mục sản phẩm')
        res.redirect('back')
    } catch {
        req.flash('error', 'Thêm danh mục sản phẩm không thành công')
        res.redirect('back')
    }
}