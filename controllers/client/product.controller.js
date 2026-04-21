const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product.category.model')

const priceHelper = require('../../helper/price')
const findChildrenHelper = require('../../helper/find-childrenId')

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

//[GET] /products/detail/:slugProduct
module.exports.detail = async (req,res) => {
    const find = {
        deleted: false,
        slug: req.params.slugProduct,
        status: "active",
    }
    const product = await Product.findOne(find)
    const newPrice = priceHelper.newPriceProduct(product)
    product.newPrice = newPrice
    res.render("client/pages/products/detail",{
        pageTitle: product.title,
        product: product,
    })
}

//[GET] /products/:slugCategory
module.exports.slugCategory = async (req,res) => {
    const slugCategory = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })
    if(!slugCategory){
        req.flash('error','Danh mục không tồn tại!')
        res.redirect('back')
        return;
    }
    const childIds = await findChildrenHelper.findAllChildrenIds(slugCategory.id,false)
    const products = await Product.find({
        product_category_id: { $in: childIds},
        status: "active",
        deleted: false
    })
    
    res.render('client/pages/products/index.pug', {
        pageTitle: slugCategory.title,
        products: products,
        slugCategory: slugCategory
    })

    
}