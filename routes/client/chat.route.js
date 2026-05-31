const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/chat.controller')

const middleware = require('../../middlewares/client/authentication.middleware')

router.get('/', controller.index)

module.exports = router;