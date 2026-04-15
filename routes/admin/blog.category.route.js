const express = require('express')
const multer = require('multer')

const blogValidate = require('../../Validate/admin/blog.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()
const router = express.Router();

const blogCategoryController = require('../../controllers/admin/blog.category.controller')

router.get('/', blogCategoryController.index)

router.post('/upload-tinymce',
    upload.single('file'),
    uploadCloud.upload,
    (req, res) => {
        res.json({
            location: req.body.file
        });
    }
);

router.get('/create', blogCategoryController.create)
router.post('/create', 
    upload.single('featuredImage'),
    uploadCloud.upload,
    blogValidate.createPost,
    blogCategoryController.createPost
);

router.get('/edit/:id', blogCategoryController.edit)
router.patch('/edit/:id', 
    upload.single('featuredImage'),
    uploadCloud.upload,
    blogValidate.createPost,
    blogCategoryController.editPatch
);

router.delete('/deleteOne/:id', blogCategoryController.deleteOne)

router.get('/detail/:id', blogCategoryController.detail);

router.patch('/change-multi', blogCategoryController.changeMulti);

module.exports = router;