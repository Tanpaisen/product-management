const uploadToCloudinaryHelper = require('../../helper/upLoadtoCloud')

const Chat = require('../../models/chat.model')

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    const roomChatID = req.params.roomChatID;

    _io.once('connection', async (socket) => {
        socket.join(roomChatID);
        socket.on('CLIENT_SEND_MESSAGE', async (data) => {

            let images = [];
            for (const image of data.images) {
                const link = await uploadToCloudinaryHelper(image);
                images.push(link);
            }

            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatID,
                content: data.content,
                images: images,
            })
            chat.save();

            _io.to(roomChatID).emit('SERVER_RETURN_MESSAGE', {
                user_id: userId,
                room_chat_id: roomChatID,
                content: data.content,
                fullname: fullname,
                images: images,
            });
        });

        // typing
        socket.on('CLIENT_SEND_TYPING', (type) => {
            socket.broadcast.to(roomChatID).emit('SERVER_RETURN_TYPING', {
                user_id: userId,
                room_chat_id: roomChatID,
                fullname: fullname,
                type: type,
            });
        })
    });
}