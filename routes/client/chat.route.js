const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/chat.controller')

const middleware = require('../../middlewares/client/authentication.middleware')
const chatMiddlewrae = require('../../middlewares/client/chat.middleware')

router.get('/:roomChatID', chatMiddlewrae.roomChat, controller.index)

module.exports = router;