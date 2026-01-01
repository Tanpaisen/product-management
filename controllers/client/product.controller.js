const Product = require('../../models/product.model')
module.exports.index = async (req, res) => {
    const products = await Product.find({
        'deleted':false, 
        'status':'active' 
    });

    const newProduct = products.map(item => {
        item.newPrice = (item.price*(100-item.discountPercentage)/100).toFixed(1);
        return item;
    }) 

    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang sản phẩm",
        products: newProduct,
    })
}