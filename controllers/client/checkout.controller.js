const Order = require('../../models/order.model')
const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const priceHelper = require('../../helper/price')

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    
    const cart = await Cart.findOne({_id: cartId})
    for(const product of cart.products){
        const productInfo = await Product.findOne({_id: product.product_id}).select('title price discountPercentage thumbnail')
        
        productInfo.newPrice = priceHelper.newPriceProduct(productInfo)
        console.log(productInfo.newPrice)
        product.productInfo = productInfo
        product.totalPrice = productInfo.newPrice*product.quantity
    }
    cart.totalPrice = cart.products.reduce((sum, product) => sum+product.totalPrice,0)

    res.render('client/pages/checkout/index.pug',{
        pageTitle: 'Trang thanh toán',
        cartDetail: cart
    })
}