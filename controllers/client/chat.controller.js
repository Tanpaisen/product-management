const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')
//[GET]/chat/index
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;

    _io.once('connection', async (socket) => {
        console.log('a user connected:' + socket.id)
        socket.on('CLIENT_SEND_MESSAGE', (msg) => {
            console.log('message: ' + msg);
            const chat = new Chat({
                user_id: userId,
                content: msg,
            })
            chat.save();
            _io.emit('SERVER_RETURN_MESSAGE', {
                user_id: userId,
                content: msg,
                fullname: fullname,
            });
        });
    });
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