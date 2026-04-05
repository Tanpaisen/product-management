const Cart = require('../../models/cart.model')

module.exports.cart = async (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        const time = 365 * 24 * 60 * 60 * 1000;
        res.cookie('cartId',cart.id, { expires: new Date(Date.now() + time), httpOnly: true })
    }
    else{
        const carts = await Cart.find()
        
        for(cart of carts){
            cart.totalQuantity = cart.products.reduce((sum,item) => sum+item.quantity,0)
        }
        res.locals.cart = cart
        
    }
    next();
}