const Product = require('../../models/product.model')

const findSearchHelper = require('../../helper/filter-search')

//[GET] /search
module.exports.index = async (req,res) => {
    let find = {
        deleted: false,
        status: "active"
    }
    const search = findSearchHelper(req.query)
    if(search){
        find.title = search.regex
        products = await Product.find(find)
    }
    res.render('client/pages/search/index.pug',{
        products: products
    })
}