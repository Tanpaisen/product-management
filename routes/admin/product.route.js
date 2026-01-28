const express = require('express')
const multer = require('multer')
const validateProduct = require('../../Validate/admin/product.validate')

const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()
const router = express.Router();

const products = require('../../controllers/admin/product.controller')

router.get('/', products.index)

router.patch('/change-status/:status/:id/', products.changeStatus)

router.patch('/change-multi', products.changeMulti)

router.delete('/deleteOne/:id', products.deleteOne)
router.delete('/delete/:id', products.delete)

router.patch('/restoreOne/:id', products.restoreOne)

router.get('/create', products.create);
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validateProduct.createPost,
    products.createPost
);

router.get('/edit/:id', products.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validateProduct.createPost,
    products.editPatch
);

router.get('/detail/:id', products.detail)

module.exports = router;