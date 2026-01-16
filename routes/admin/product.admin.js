const express = require('express')
const multer = require('multer')
const validateProduct = require('../../Validate/admin/product.validate')
const storageMulter = require('../../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const router = express.Router();

const products = require('../../controllers/admin/product.admin')

router.get('/', products.index)

router.patch('/change-status/:status/:id/', products.changeStatus)

router.patch('/change-multi', products.changeMulti)

router.delete('/deleteOne/:id', products.deleteOne)
router.delete('/delete/:id', products.delete)

router.patch('/restoreOne/:id', products.restoreOne)

router.get('/create', products.create);
router.post(
    '/create', 
    upload.single('thumbnail'), 
    validateProduct.createPost,
    products.createPost
);


module.exports = router;