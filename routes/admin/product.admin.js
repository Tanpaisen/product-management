const express = require('express')
const router = express.Router();

const products = require('../../controllers/admin/product.admin')

router.get('/', products.index)

module.exports = router;