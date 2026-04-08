const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const priceHelper = require('../../helper/price')
//[GET] /cart
module.exports.index = async (req, res) => {

    const cart = await Cart.findOne({_id: req.cookies.cartId})
    for(const item of cart.products){
        const productInfo = await Product.findOne({_id: item.product_id}).select('title thumbnail slug price discountPercentage description content')
        productInfo.newPrice = priceHelper.newPriceProduct(productInfo)

        item.productInfo = productInfo
        item.totalPrice = productInfo.newPrice * item.quantity
    }
    
    cart.totalPrice = cart.products.reduce((sum, product) => sum + product.totalPrice,0)

    console.log(cart)
    res.render('client/pages/cart/index',{
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

    const cart = await Cart.findOne({_id: cartId})
    
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
    else{
        await Cart.updateOne({_id: cartId},{
            $push:{
                products: products
            }
        })
    }
    req.flash('success','Thêm vào giỏ hàng thành công')
    res.redirect('back')
}