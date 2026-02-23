const ProductCategory = require('../../models/product.category.model');
const filterStatusHelper = require('../../helper/filter-status')
const filterSearchHelper = require('../../helper/filter-search')
const createTreeHelper = require('../../helper/create-tree')
const systemConfig = require('../../config/system')

//[GET] /admin/products-category
module.exports.index = async (req, res) => {

    const find = {
        'deleted': false,
    }

    const restoreFind = {
        'deleted': true,
    }

    // Lọc
    const filterStatus = filterStatusHelper(req.query)

    if (req.query.status) {
        filterStatus.status = req.query.status;
        find.status = filterStatus.status;
    }
    // Tìm kiếm
    const search = filterSearchHelper(req.query)

    if (req.query.keyword) {
        search.keyword = req.query.keyword;
        find.title = search.regex;
    }

    //sort
    let sort = {};

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue
    } else {
        sort.position = "desc"
    }

    let productsCategory
    let pageTitle
    if (req.query.status == 'restore') {
        productsCategory = await ProductCategory.find(restoreFind)
            .sort(sort)
    }
    else {
        productsCategory = await ProductCategory
            .find(find)
            .sort(sort)
    }

    //tree
    const records = createTreeHelper.tree(productsCategory)

    res.render('admin/pages/products-category/index', {
        pageTitle: 'Danh mục sản phẩm',
        productsCategory: records,
        filterStatus: filterStatus,
        keyword: search.keyword,
    })
}

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find);
    const tree = createTreeHelper.tree(records);
    res.render('admin/pages/products-category/create.pug', {
        pageTitle: "Thêm danh mục sản phẩm",
        records: tree,
    })
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
    const productsCategory = new ProductCategory(req.body);
    await productsCategory.save();

    req.flash('success', 'Thêm danh mục sản phẩm thành công!');
    const backUrl = `${systemConfig.prefixAdmin}/products-category`; // URL mặc định nếu không tìm thấy trang trước
    res.redirect(backUrl);
}

//[PATCH] /admin/products-category/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    console.log(status);
    await ProductCategory.updateOne({ _id: id }, { status: status })

    const back = req.get('Referer') || `${systemConfig.prefixAdmin}/products-category`;
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect(back);

}

//[GET] /admin/products-category/edit
module.exports.edit = async (req, res) => {
    try {
        const data = {
            deleted: false,
            _id: req.params.id,
        }

        const newData = await ProductCategory.findOne(data);

        const find = {
            deleted: false,
        }

        const records = await ProductCategory.find(find);
        const tree = createTreeHelper.tree(records);
        res.render('admin/pages/products-category/edit.pug', {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: newData,
            records: tree
        })
    }
    catch (error) {
        req.flash("error", "Không thể truy vấn sản phẩm này!")
        const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
        res.redirect(backUrl);
    }
}

//[PATCH] /admin/products-category/editPatch
module.exports.editPatch = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    const id = req.params.id
    try {
        await ProductCategory.updateOne({ _id: id }, req.body)
        req.flash("success", "Cập nhật thành công!")
    }
    catch (error) {
        req.flash("error", "Cập nhật thất bại!")
    }
    const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
    res.redirect(backUrl);
};

//[GET] /admin/products-category/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const productsCategory = await ProductCategory.findOne(find);
        res.render('admin/pages/products-category/detail.pug', {
            pageTitle: productsCategory.title,
            productsCategory: productsCategory,
        })
    }
    catch (error) {
        req.flash("error", "Không thể truy vấn sản phẩm này!")
        const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
        res.redirect(backUrl);
    }
}

//[PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash('success', `Thay đổi trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash('success', `Thay đổi trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "position":
            for (let item of ids) {
                let [id, pos] = item.split("-");
                pos = parseInt(pos);
                await ProductCategory.updateMany({ _id: id }, { position: pos })
            }
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        case "deleteMany":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                status: "restore",
                deleted: true,
            })
            req.flash('success', `Xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "restoreMany":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                status: "active",
                deleted: false,
            })
            req.flash('success', `Khôi phục thành công ${ids.length} sản phẩm!`);
            break;
        default:
            return res.status(400).send("Invalid type");
    }
    const backUrl = req.get("Referer") || "/admin/products"; // URL mặc định nếu không tìm thấy trang trước
    res.redirect(backUrl);
}

//[PATCH] /admin/products-category/deleteOne
module.exports.deleteOne = async (req, res) => {
    const id = req.params.id

    //Xóa tạm thời
    await ProductCategory.updateOne({ _id: id }, { deleted: "true", status: "restore" });
    const back = req.get("Referer");
    req.flash('success', `Xóa thành công sản phẩm`);
    res.redirect(back);

}
//[PATCH] /admin/products-category/delete
module.exports.delete = async (req, res) => {
    const id = req.params.id

    //Xóa vĩnh viễn
    await ProductCategory.deleteOne({ _id: id })

    const back = req.get("Referer");
    req.flash('success', `Xóa thành công sản phẩm`);
    res.redirect(back);

}

//[PATCH] /admin/products-category/restoreOne
module.exports.restoreOne = async (req, res) => {
    const id = req.params.id

    await ProductCategory.updateOne({ _id: id }, { deleted: "false", status: "active" });
    const back = req.get("Referer");
    req.flash('success', 'Khôi phục thành công!');
    res.redirect(back);
}