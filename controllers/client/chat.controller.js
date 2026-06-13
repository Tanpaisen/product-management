const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')

const chatSocket = require('../../socket/client/chat.socket')

//[GET]/chat/:roomChatID
module.exports.index = async (req, res) => {
    chatSocket(req, res);
    const roomChatID = req.params.roomChatID;
    const chats = await Chat.find({ deleted: false,room_chat_id: roomChatID })
    for (const chat of chats) {
        const userInfo = await User.findOne({ 
            deleted: false, 
            _id: chat.user_id , 
        }).select('fullname ')
        chat.userInfo = userInfo;
    }


    res.render('client/pages/chats/index', {
        pageTitle: 'Chat',
        chats: chats,
    })
}