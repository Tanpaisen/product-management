const Cart = require('../../models/cart.model')

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