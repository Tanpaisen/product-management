const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filter-status')
const filterSearchHelper = require('../../helper/filter-search')

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
        search.keyword = query.keyword;
        find.title = search.keyword
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Trang quản lý sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
    })
}