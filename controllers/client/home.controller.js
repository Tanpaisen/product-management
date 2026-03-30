const Product = require('../../models/product.model')

const priceProductHelper = require('../../helper/price')

//[GET] /
module.exports.index = async (req, res) => {

    const productsFeatured = await Product.find({deleted: false, featured: "1", status: "active"}).sort({ position: "desc" });
    const newProductsFeatured = priceProductHelper.newPriceProducts(productsFeatured)
    res.render('client/pages/home/index.pug', {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured
    })
}