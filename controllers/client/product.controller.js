const Product = require('../../models/product.model')

const priceHelper = require('../../helper/price')
//[GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        'deleted':false, 
        'status':'active',
    }).sort({ position: "desc" });

    const newProducts = priceHelper.newPriceProducts(products)

    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang sản phẩm",
        products: newProducts,
    })
}

//[GET] /products/detail/slug
module.exports.detail = async (req,res) => {
    const find = {
        deleted: false,
        slug: req.params.slug,
        status: "active",
    }
    const product = await Product.findOne(find)
    res.render("client/pages/products/detail",{
        pageTitle: product.title,
        product: product,
    })
}
