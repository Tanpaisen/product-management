const express = require('express')
const multer = require('multer')

const validateProduct = require('../../Validate/admin/product.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()
const router = express.Router();

const productsCategory = require('../../controllers/admin/product.category.controller')

router.get('/', productsCategory.index)

router.get('/create', productsCategory.create)
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validateProduct.createPost,
    productsCategory.createPost
)

router.patch('/change-status/:status/:id', productsCategory.changeStatus)

router.patch('/change-multi', productsCategory.changeMulti)

router.delete('/deleteOne/:id', productsCategory.deleteOne)
router.delete('/delete/:id', productsCategory.delete)

router.patch('/restoreOne/:id', productsCategory.restoreOne)

router.get('/edit/:id', productsCategory.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validateProduct.createPost,
    productsCategory.editPatch
);

router.get('/detail/:id', productsCategory.detail)

module.exports = router;