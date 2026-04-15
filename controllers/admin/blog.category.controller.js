const BlogCategory = require('../../models/blog.category.model')

const createTreeHelper = require('../../helper/create-tree')
const searchHelper = require('../../helper/filter-search')
const filterStatusHelper = require('../../helper/filter-status')
const paginationHelper = require('../../helper/pagination')

//[GET] admin/blogs-category/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }



    //Tim kiem
    const search = searchHelper(req.query)
    if (req.query.status) {
        find.title = search.regex
    }

    //Lọc
    const filterStatus = filterStatusHelper(req.query)

    const status = req.query.status
    if (status) {
        if (status == 'restore') {
            find = {
                status: 'restore',
                deleted: true,
            }
        }
    }
    //pagination
    const countProducts = await BlogCategory.countDocuments({ deleted: false })
    const pageObject = paginationHelper(
        req.query,
        countProducts,
        {
            limitPage: 8,
            curentPage: 1,
        }
    )
    //End pagination

    const blogsCategory = await BlogCategory.find(find)
        .limit(pageObject.limitPage)
        .skip(pageObject.skipPage)
    console.log(blogsCategory)
    let tree
    if (req.query.status != 'restore') {
        tree = createTreeHelper.tree(blogsCategory)
    }

    res.render('admin/pages/blogs-category/index.pug', {
        pageTitle: 'Trang quản lý danh mục bài viết',
        blogsCategory: tree || blogsCategory,
        filterStatus: filterStatus,
        pageObject: pageObject,
    })
}

//[GET] admin/blogs-category/create
module.exports.create = async (req, res) => {

    const blogsCategory = await BlogCategory.find({ deleted: false })
    const tree = createTreeHelper.tree(blogsCategory)

    res.render('admin/pages/blogs-category/create.pug', {
        pageTitle: 'Thêm mới danh mục bài viết',
        blogsCategory: tree,
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

//[GET] admin/blogs-category/edit/:id
module.exports.edit = async (req, res) => {

    const id = req.params.id;

    const data = await BlogCategory.findOne({ _id: id, deleted: false })

    const childrenIds = await findAllChildrenIdHelper.findAllChildrenIds(req.params.id, false);
    const find = {
        deleted: false,
        _id: { $nin: childrenIds }
    }

    const records = await ProductCategory.find(find);
    const tree = createTreeHelper.tree(records);
    res.render('admin/pages/blogs-category/edit.pug', {
        pageTitle: 'Thêm mới danh mục bài viết',
        data: data,
        tree: tree,
    })
}

//[PATCH] admin/blogs-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        req.body.position = parseInt(req.body.position)

        await BlogCategory.updateOne({ _id: req.params.id }, req.body)

        req.flash('success', 'Cập nhật danh mục bài viết thành công')
        res.redirect('back')
    } catch {
        req.flash('error', 'Cập nhật danh mục bài viết thất bại')
        res.redirect('back')
    }

}

//[DELETE]/admin/blogs-category/deleteOne/:id
module.exports.deleteOne = async (req, res) => {
    const id = req.params.id;

    await BlogCategory.updateOne({ _id: id }, { deleted: true, status: "restore" })

    req.flash('success', 'Xóa thành công')
    res.redirect('back')
}

//[GET] admin/blogs-category/detail/:id
module.exports.detail = async (req, res) => {

    const id = req.params.id;

    const data = await BlogCategory.findOne({ _id: id, deleted: false })
    res.render('admin/pages/blogs-category/detail.pug', {
        pageTitle: 'Thêm mới danh mục bài viết',
        data: data,
    })
}

//[PATCH]/admin/blogs-category/change-multi/
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ')

    switch (type) {
        case 'active': {
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: 'active' })
            req.flash('success', `Sửa thành công ${ids.length} bài viết!`)
            break;
        }
        case 'inactive': {
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: 'inactive' })
            req.flash('success', `Sửa thành công ${ids.length} bài viết!`)
            break;
        }
        case 'position': {
            console.log(ids)
            for (const item of ids) {
                console.log(item)
                const [id, position] = item.split('-')
                await BlogCategory.updateOne({ _id: id }, { position: position })
            }
            req.flash('success', `Sửa thành công ${ids.length} bài viết!`)
            break;
        }
        case 'deleteMany': {
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: 'restore', deleted: true })
            req.flash('success', `Xóa thành công ${ids.length} bài viết!`)
            break;
        }
        case 'restoreMany': {
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: 'active', deleted: false })
            req.flash('success', `Khôi thành công ${ids.length} bài viết!`)
            break;
        }
        default: {
            req.flash('error', `Vui lòng chọn 1 lựa chọn!`)
            break;
        }
    }

    res.redirect('back')
}