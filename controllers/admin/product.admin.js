const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filter-status')
const filterSearchHelper = require('../../helper/filter-search')
const paginationHelper = require('../../helper/pagination')

//[GET] /admin/products
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

    //Pagination
    const countProducts = await Product.countDocuments(find);

    const pageObject = paginationHelper(
        req.query,
        countProducts,
        {
            limitPage: 4,
            curentPage: 1,
        },
    );
    let products
    let pageTitle
    if (req.query.status == 'restore') {
        products = await Product.find(restoreFind)
                                .sort({ position: "desc" })
                                .limit(pageObject.limitPage)
                                .skip(pageObject.skipPage);
    }
    else {
        products = await Product
                                .find(find)
                                .sort({ position: "desc" })
                                .limit(pageObject.limitPage)
                                .skip(pageObject.skipPage);
    }
    res.render('admin/pages/products/index.pug', {
        pageTitle: "Trang quản lý sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pageObject: pageObject,
    })


}

//[PATCH] /admin/products/change-status

module.exports.changeStatus = async (req, res) => {
    const id = req.params.id
    const statusChange = req.params.status
    console.log(statusChange)
    if (statusChange === 'restore') {
        await Product.updateOne({ _id: id }, { deleted: "false", status: "active" });
        req.flash('success', 'Khôi phục thành công!');
    }
    else {
        await Product.updateOne({ _id: id }, { status: statusChange });
        req.flash('success', 'Thay đổi trạng thái thành công!');
    }
    const backUrl = req.get("Referer") || "/admin/products"; // URL mặc định nếu không tìm thấy trang trước
    res.redirect(backUrl);
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash('success', `Thay đổi trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash('success', `Thay đổi trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "position":
            for (let item of ids){
                let [id, pos] = item.split("-");
                pos = parseInt(pos);
                await Product.updateMany({ _id: id  }, { position: pos })
                
            }
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        case "deleteMany":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "restore",
                deleted: true,
            })
            req.flash('success', `Xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "restoreMany":
            await Product.updateMany({ _id: { $in: ids } }, {
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

//[PATCH] /admin/products/deleteOne
module.exports.deleteOne = async (req, res) => {
    const id = req.params.id

    //Xóa vĩnh viễn
    // await Product.deleteOne({_id:id})

    //Xóa tạm thời
    await Product.updateOne({ _id: id }, { deleted: "true", status: "restore" });
    const back = req.get("Referer");
    req.flash('success', `Xóa thành công sản phẩm`);
    res.redirect(back);
    
}

//[PATCH] /admin/products/restoreOne
module.exports.restoreOne = async (req, res) => {
    const id = req.params.id

    await Product.updateOne({ _id: id }, { deleted: "false", status: "active" });
    const back = req.get("Referer");
    req.flash('success', 'Khôi phục thành công!');
    res.redirect(back);
}