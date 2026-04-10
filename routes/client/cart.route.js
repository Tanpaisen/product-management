const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/client/cart.controller')

router.get('/', cartController.index)

router.post('/add/:id', cartController.addPost)

router.get('/delete/:product_id', cartController.delete)

router.get('/update-quantity/:productId/:newQuantity', cartController.updateQuantity)

module.exports = router;