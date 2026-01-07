const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filter-status')
const filterSearchHelper = require('../../helper/filter-search')
const paginationHelper = require('../../helper/pagination')

//[GET] /admin/products
module.exports.index = async (req, res) => {
    
    const find = {
        'deleted':false,
    }

    // Lọc
    const filterStatus = filterStatusHelper(req.query)

    if(req.query.status){
        filterStatus.status = req.query.status;
        find.status = filterStatus.status;
    }
    // Tìm kiếm
    const search = filterSearchHelper(req.query)
    
    if(req.query.keyword){
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

    const products = await Product.find(find).limit(pageObject.limitPage).skip(pageObject.skipPage);

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Trang quản lý sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pageObject:pageObject,
    })
}

//[GET] /admin/products/change-status

module.exports.changeStatus = async (req, res) => {
    if(req.params){

        const id = req.params.id
        const statusChange =req.params.status
        const originUrl = req.query._origin;
        console.log(originUrl)
        await Product.updateOne({ _id: id }, { status: statusChange });
        if (originUrl) {
            return res.redirect(originUrl);
        }
    }
}