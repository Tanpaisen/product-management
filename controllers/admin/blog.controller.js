const Blog = require('../../models/blog.model')
const createTreeHelper = require('../../helper/create-tree')

const BlogCategory = require('../../models/blog.category.model')

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

    const records = await BlogCategory.find({deleted: false})
    const tree = createTreeHelper.tree(records)
    res.render('admin/pages/blogs/create.pug', {
        pageTitle: 'Trang thêm bài viết',
        records: records,
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


//[GET] admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
    const blog = await Blog.findOne({_id: req.params.id, deleted: false})

    const records = await BlogCategory.find({deleted: false})
    const tree = createTreeHelper.tree(records)
    res.render('admin/pages/blogs/edit.pug', {
        pageTitle: 'Chỉnh sửa bài viết',
        blog: blog,
        records: tree,
    })
}
//[PATCH] admin/blogs/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position)


        console.log(req.body)
        await Blog.updateOne({_id: id},req.body)

        req.flash('success', 'Cập nhật bài viết thành công!')
        res.redirect("back");
    } catch {
        req.flash('error', 'Cập nhật bài viết không thành công!')
        res.redirect('back')
    }
}

//[GET] admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
    const blog = await Blog.findOne({_id: req.params.id, deleted: false})

    console.log(blog)
    res.render('admin/pages/blogs/detail.pug', {
        pageTitle: 'Chỉnh sửa bài viết',
        blog: blog,
    })
}