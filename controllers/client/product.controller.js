const Product = require('../../models/product.model')

//[GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        'deleted':false, 
        'status':'active',
    }).sort({ position: "desc" });

    const newProduct = products.map(item => {
        item.newPrice = (item.price*(100-item.discountPercentage)/100).toFixed(1);
        return item;
    }) 

    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang sản phẩm",
        products: newProduct,
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
