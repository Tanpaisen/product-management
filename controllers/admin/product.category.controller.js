const ProductCategory = require('../../models/product.category.model');

const filterStatusHelper = require('../../helper/filter-status')
const filterSearchHelper = require('../../helper/filter-search')
const createTreeHelper = require('../../helper/create-tree')
const findAllChildrenIdHelper = require('../../helper/find-childrenId')
const validateParentActiveHelper = require('../../helper/validate-parentActive')

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
    let records
    if (req.query.status == 'restore') {
        productsCategory = await ProductCategory
            .find(restoreFind)
            .sort(sort)
    }
    else {
        productsCategory = await ProductCategory
            .find(find)
            .sort(sort)
        records = createTreeHelper.tree(productsCategory);
    }


    res.render('admin/pages/products-category/index', {
        pageTitle: 'Danh mục sản phẩm',
        productsCategory: records || productsCategory,
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

    // 1. Lấy toàn bộ records để phục vụ validate và tìm con trên RAM
    const records = await ProductCategory.find({ deleted: false });

    // 2. Tìm danh mục hiện tại
    const current = records.find(r => r.id === id);
    if (!current) {
        req.flash('error', 'Không tìm thấy danh mục sản phẩm!');
        return res.redirect("back");
    }

    // 3. Xử lý logic
    if (status === "active") {
        const isParentOk = await validateParentActiveHelper.validateParentActive(current.parentId, records);

        if (!isParentOk) {
            req.flash('error', `Không thể kích hoạt ${current.title} do cấp cha chưa sẵn sàng!`);
            return res.redirect("back");
        }

        // Nếu cha Ok -> Kích hoạt chính nó và đám con
        const allIds = await findAllChildrenIdHelper.findAllChildrenIds(id);
        await ProductCategory.updateMany({ _id: { $in: allIds } }, { status: status });
        req.flash('success', 'Kích hoạt danh mục và các con thành công!');
    }
    else {
        // TRƯỜNG HỢP INACTIVE: Không cần check cha, tắt luôn nó và đám con
        const allIds = await findAllChildrenIdHelper.findAllChildrenIds(id);
        await ProductCategory.updateMany({ _id: { $in: allIds } }, { status: status });
        req.flash('success', 'Đã dừng hoạt động danh mục và các con!');
    }

    const back = req.get('Referer') || `${systemConfig.prefixAdmin}/products-category`;
    res.redirect(back);
};

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
    const records = await ProductCategory.find({});

    let childIds = [];
    let isValidateParentActive = []

    for (const id of ids) {
        let allIds = []
        const current = records.find(r => r.id === id);
        if (current) {
            const isOk = await validateParentActiveHelper.validateParentActive(current.parentId, records)
            if (isOk) {
                if (type === "restoreMany") {
                    allIds = await findAllChildrenIdHelper.findAllChildrenIds(id, true);
                } else {
                    allIds = await findAllChildrenIdHelper.findAllChildrenIds(id);
                }
                childIds.push(...allIds);
            } else {
                isValidateParentActive.push(current.title);
            }
        }
    }
    childIds = [...new Set(childIds)];
    switch (type) {
        case "active":
        case "restoreMany":
            if (childIds.length > 0) {
                await ProductCategory.updateMany({ _id: { $in: childIds } }, { status: "active", deleted: false })
                req.flash('success', `Thay đổi trạng thái thành công ${childIds.length} sản phẩm!`);
            }
            if (isValidateParentActive.length > 0) {
                req.flash('error', `Không thể thay đổi trạng thái của ${isValidateParentActive.join(", ")} do cấp cha chưa ở trạng thái sẵn sàng!`);
            }
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: childIds } }, { status: "inactive" })
            req.flash('success', `Thay đổi trạng thái thành công ${childIds.length} sản phẩm!`);
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
            await ProductCategory.updateMany({ _id: { $in: childIds } }, {
                status: "restore",
                deleted: true,
            })
            req.flash('success', `Xóa thành công ${childIds.length} sản phẩm!`);
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
    const allIds = await findAllChildrenIdHelper.findAllChildrenIds(id);

    //Xóa tạm thời
    await ProductCategory.updateMany({ _id: { $in: allIds } }, { deleted: "true", status: "restore" });
    const back = req.get("Referer");
    req.flash('success', `Xóa thành công sản phẩm và các danh mục con của nó`);
    res.redirect(back);

}
//[PATCH] /admin/products-category/delete
module.exports.delete = async (req, res) => {
    const id = req.params.id

    //Xóa vĩnh viễn
    const allIds = await findAllChildrenIdHelper.findAllChildrenIds(id, true);
    await ProductCategory.deleteMany({ _id: { $in: allIds } });

    const back = req.get("Referer");
    req.flash('success', `Xóa thành công sản phẩm`);
    res.redirect(back);

}

//[PATCH] /admin/products-category/restoreOne
module.exports.restoreOne = async (req, res) => {
    const id = req.params.id

    const records = await ProductCategory.find({});

    const current = records.find(r => r.id === id);

    if (!current) {
        req.flash('error', 'Không tìm thấy danh mục sản phẩm!');
        const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
        return res.redirect(backUrl)
    }

    const isParentOk = await validateParentActiveHelper.validateParentActive(current.parentId, records);
    if (!isParentOk) {
        req.flash('error', `Không thể khôi phục ${current.title} do cấp cha chưa sẵn sàng!`);
        const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
        return res.redirect(backUrl)
    }
    const allIds = await findAllChildrenIdHelper.findAllChildrenIds(id, true);

    await ProductCategory.updateMany(
        { _id: { $in: allIds } },
        {
            deleted: false,
            status: "active"
        }
    );

    req.flash('success', `Khôi phục thành công ${current.title} và các danh mục con!`);
    const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products-category`;
    res.redirect("back");
}