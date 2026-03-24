const Blog = require('../../models/blog.model')

//[GET] admin/blogs/
module.exports.index = async (req, res) => {
    const blogs = await Blog.find({ deleted: false })

    res.render('admin/pages/blogs/index.pug', {
        pageTitle: 'Trang quản lý bài viết',
        blogs: blogs,
    })
}

//[GET] admin/blogs/create
module.exports.create = async (req, res) => {

    res.render('admin/pages/blogs/create.pug', {
        pageTitle: 'Trang thêm bài viết',
    })
}

//[POST] admin/blogs/create
module.exports.createPost = async (req, res) => {
    try {
        const countBlog = await Blog.countDocuments()
        if(req.body.position == ""){
            req.body.position = countBlog+1;
        }
        
        const blogs = new Blog(req.body)
        blogs.save();

        req.flash('success', 'Thêm bài viết thành công!')
        res.redirect("back");
    } catch {
        req.flash('error', 'Thêm bài viết không thành công!')
        res.redirect('back')
    }
}

//[DELETE] admin/blogs/deleteOne/:id
module.exports.deleteOne = async (req, res) => {
    try {
        const id = req.params.id;

        await Blog.updateOne({_id: id},{deleted: true, status: "restore"})

        req.flash('success', 'Xóa bài viết thành công!')
        res.redirect("back");
    } catch {
        req.flash('error', 'Xóa bài viết không thành công!')
        res.redirect('back')
    }
}