const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user_id: String,
    userInfo:[
        {
            fullnam: String,
            phone: String,
            address: String,
        }
    ],
    productInfo:[{
        title: String,
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