const Order = require('../../models/order.model')
const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const priceHelper = require('../../helper/price')

//[GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({ _id: cartId })
    for (const product of cart.products) {
        const productInfo = await Product.findOne({ _id: product.product_id }).select('title price discountPercentage thumbnail')

        productInfo.newPrice = priceHelper.newPriceProduct(productInfo)
        console.log(productInfo.newPrice)
        product.productInfo = productInfo
        product.totalPrice = productInfo.newPrice * product.quantity
    }
    cart.totalPrice = cart.products.reduce((sum, product) => sum + product.totalPrice, 0)

    res.render('client/pages/checkout/index.pug', {
        pageTitle: 'Trang thanh toán',
        cartDetail: cart
    })
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart = await Cart.findOne({ _id: cartId })
    const products = [];
    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }
        const productInfo = await Product
            .findOne({ _id: product.product_id })
            .select('price discountPercentage')
        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }
    if (products.length > 0) {
        const orderInfo = {
            cart_id: cartId,
            userInfo: userInfo,
            productInfo: products,
        }
        const order = new Order(orderInfo)
        order.save();

        for (const product of products) {
            objectProduct = {
                product_id: product.product_id,
                quantity: product.quantity,
            }
            await Cart.updateOne({ _id: cartId }, {
                $pull: { products: objectProduct }
            })
        }
        res.redirect(`/checkout/success/${order._id}`)
    }
    else {
        req.flash('error', 'Giỏ hàng hiện không có sản phẩm')
        res.redirect('back')
    }

}