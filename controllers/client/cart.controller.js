const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const priceHelper = require('../../helper/price')
//[GET] /cart
module.exports.index = async (req, res) => {

    const cart = await Cart.findOne({ _id: req.cookies.cartId })
    for (const item of cart.products) {
        const productInfo = await Product.findOne({ _id: item.product_id }).select('title thumbnail slug price discountPercentage description content')
        productInfo.newPrice = priceHelper.newPriceProduct(productInfo)

        item.productInfo = productInfo
        item.totalPrice = productInfo.newPrice * item.quantity
    }

    cart.totalPrice = cart.products.reduce((sum, product) => sum + product.totalPrice, 0)

    res.render('client/pages/cart/index', {
        pageTitle: 'Giỏ hàng',
        cartDetail: cart
    })
}

//[GET] /cart/add/:id
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId
    const quantity = parseInt(req.body.quantity)
    const productId = req.params.id

    const products = {
        product_id: productId,
        quantity: quantity,
    }

    const cart = await Cart.findOne({ _id: cartId })

    const exitProduct = cart.products.find((item) => item.product_id == productId)
    if (exitProduct) {
        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            $inc: {
                'products.$.quantity': quantity,
            }
        })
    }
    else {
        await Cart.updateOne({ _id: cartId }, {
            $push: {
                products: products
            }
        })
    }
    req.flash('success', 'Thêm vào giỏ hàng thành công')
    res.redirect('back')
}

//[GET] /cart/delete/:product_id
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.product_id;

    await Cart.updateOne({ _id: cartId }, {
        $pull: {
            products: { product_id: productId }
        }
    })

    req.flash('success', 'Xóa sản phẩm thành công!')
    res.redirect('back')
}

//[GET] /cart/update-quantity/:id/:newQuantity
module.exports.updateQuantity = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const newQuantity = req.params.newQuantity;
    
    const products = {
        product_id: productId,
        quantity: newQuantity,
    }
    await Cart.updateOne({_id: cartId, 'products.product_id': productId},{
        $set: {
            'products.$.quantity': newQuantity
        }
    })
    console.log(cartId, productId, newQuantity)

    req.flash('success', 'Xóa sản phẩm thành công!')
    res.redirect('back')
}