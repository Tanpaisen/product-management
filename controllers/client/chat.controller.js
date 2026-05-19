const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')

const chatSocket = require('../../socket/client/chat.socket')

//[GET]/chat/index
module.exports.index = async (req, res) => {
    chatSocket(res);
    const chats = await Chat.find({ deleted: false })
    for (const chat of chats) {
        const userInfo = await User.findOne({ deleted: false, _id: chat.user_id }).select('fullname ')
        chat.userInfo = userInfo;
    }


    res.render('client/pages/chats/index', {
        pageTitle: 'Chat',
        chats: chats,
    })
}