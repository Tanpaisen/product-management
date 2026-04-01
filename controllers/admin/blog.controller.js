const Blog = require('../../models/blog.model')
const BlogCategory = require('../../models/blog.category.model')

const createTreeHelper = require('../../helper/create-tree')
const searchHelper = require('../../helper/filter-search')
const filterStatusHelper = require('../../helper/filter-status')

//[GET] admin/blogs/
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    }

    //Tìm kiếm
    const search = searchHelper(req.query)

    if (req.query.keyword) {
        find.title = search.regex
    }

    //Lọc
    const filterStatus = filterStatusHelper(req.query)

    const status = req.query.status
    if (status) {
        find.status = status
    }

    const blogs = await Blog.find(find)

    res.render('admin/pages/blogs/index.pug', {
        pageTitle: 'Trang quản lý bài viết',
        blogs: blogs,
        filterStatus: filterStatus,
    })
}

//[GET] admin/blogs/create
module.exports.create = async (req, res) => {

    const records = await BlogCategory.find({ deleted: false })
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
        if (req.body.position == "") {
            req.body.position = countBlog + 1;
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

        await Blog.updateOne({ _id: id }, { deleted: true, status: "restore" })

        req.flash('success', 'Xóa bài viết thành công!')
        res.redirect("back");
    } catch {
        req.flash('error', 'Xóa bài viết không thành công!')
        res.redirect('back')
    }
}


//[GET] admin/blogs/edit/:id
module.exports.edit = async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id, deleted: false })

    const records = await BlogCategory.find({ deleted: false })
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

        await Blog.updateOne({ _id: id }, req.body)

        req.flash('success', 'Cập nhật bài viết thành công!')
        res.redirect("back");
    } catch {
        req.flash('error', 'Cập nhật bài viết không thành công!')
        res.redirect('back')
    }
}

//[GET] admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.id, deleted: false })

    console.log(blog)
    res.render('admin/pages/blogs/detail.pug', {
        pageTitle: 'Chỉnh sửa bài viết',
        blog: blog,
    })
}

//[PATCH] admin/blogs/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(', ')
    const type = req.body.type

    switch (type) {
        case 'active': {
            req.flash('success', `Cập nhật thành công ${ids.length} bài viết`)
            await Blog.updateMany({ _id: { $in: ids } }, { status: "active" })
            break;
        }
        case 'inactive': {
            req.flash('success', `Cập nhật thành công ${ids.length} bài viết`)
            await Blog.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            break;
        }
        case 'position': {
            for (const item of ids) {
                const [id, pos] = item.split('-');
                const position = parseInt(pos)
                await Blog.updateOne({ _id: id }, { position: position })
            }
            req.flash('success', `Cập nhật thành công ${ids.length} bài viết`)
            break;
        }
        case 'daleteMany': {
            req.flash('success', `Cập nhật thành công ${ids.length} bài viết`)
            await Blog.updateMany({ _id: { $in: ids } }, { status: "restore", deleted: true })
            break;
        }
        case 'restore': {
            req.flash('success', `Cập nhật thành công ${ids.length} bài viết`)
            await Blog.updateMany({ _id: { $in: ids } }, { status: "active", deleted: false })
            break;
        }
        default:
            return res.status(400).send("Invalid type");
    }
    res.redirect('back')
}

//[PATCH] admin/blogs/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        await Blog.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Chuyển trạng thái bài viết thành công')
        res.redirect('back')
    } catch {
        req.flash('error', 'Chuyển trạng thái bài viết thất bại')
        res.redirect('back')
    }
}