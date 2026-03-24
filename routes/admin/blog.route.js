const express = require('express')
const router = express.Router();

const blogController = require('../../controllers/admin/blog.controller')

router.get('/', blogController.index)

module.exports = router;