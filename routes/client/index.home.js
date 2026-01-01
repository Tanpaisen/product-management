const express = require('express')
const router = express.Router()

const homeController = require('../../controllers/client/home.controller')
router.get('/', homeController.index)

// router.get('/edit', )

module.exports = router;