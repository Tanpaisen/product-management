const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    cart_id: String,
    userInfo:[
        {
            fullName: String,
            phone: String,
            address: String,
        }
    ],
    productInfo:[{
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
    }],
    deleted:{
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
},{
    timestamp: true
})

const Order = mongoose.model('Order',orderSchema,'orders')

module.exports = Order;