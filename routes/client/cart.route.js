const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/client/cart.controller')

router.post('/add/:id', cartController.addPost)

// router.get('/edit', )

module.exports = router;