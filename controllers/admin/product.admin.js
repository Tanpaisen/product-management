const Product = require('../../models/product.model')
const filterStatusHelper = require('../../helper/filter-status')

//[GET] /admin/products
module.exports.index = async (req, res) => {
    
    const find = {
        'deleted':false,
    }

    // Lọc
    const filterStatus = filterStatusHelper(req.query)

    if(req.query){
        
    }
    // Tìm kiếm
    const filterSearch = {
        keyword: ""
    };
    if(req.query.keyword){
        filterSearch.keyword = req.query.keyword;
        find.title = new RegExp(req.query.keyword, 'i');
        
    }
    

    const products = await Product.find(find);

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Trang quản lý sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: filterSearch.keyword,
    })
}