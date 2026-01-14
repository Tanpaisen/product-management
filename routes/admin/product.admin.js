const express = require('express')
const router = express.Router();

const products = require('../../controllers/admin/product.admin')

router.get('/', products.index)

router.patch('/change-status/:status/:id/', products.changeStatus)

router.patch('/change-multi', products.changeMulti)

router.delete('/deleteOne/:id', products.deleteOne)

router.patch('/restoreOne/:id', products.restoreOne)

router.get('/create', products.create);
router.post('/create', products.createPost);

module.exports = router;