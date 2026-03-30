const Product = require('../../models/product.model')

const priceProductHelper = require('../../helper/price')

//[GET] /
module.exports.index = async (req, res) => {

    const productsFeatured = await Product.find({ deleted: false, featured: "1", status: "active" }).sort({ position: "desc" });
    const newProductsFeatured = priceProductHelper.newPriceProducts(productsFeatured)

    const productsNew = await Product
        .find({
            deleted: false, 
            status: "active"
        })
        .sort({ position: "desc" })
        .limit(6);
    const newProductsNew = priceProductHelper.newPriceProducts(productsNew)
    res.render('client/pages/home/index.pug', {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}