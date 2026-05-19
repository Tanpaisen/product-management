const uploadToCloudinaryHelper = require('../../helper/upLoadtoCloud')

const Chat = require('../../models/chat.model')

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;

    _io.once('connection', async (socket) => {
        console.log('a user connected:' + socket.id)
        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            console.log(data)
            let images = [];
            for (const image of data.images) {
                console.log(image)
                const link = await uploadToCloudinaryHelper(image);
                console.log(link)
                images.push(link);
                console.log(images)
            }
            console.log(images)
            
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images,
            })
            chat.save();
            _io.emit('SERVER_RETURN_MESSAGE', {
                user_id: userId,
                content: data.content,
                fullname: fullname,
                images: images,
            });
        });

        // typing
        socket.on('CLIENT_SEND_TYPING', (type) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                user_id: userId,
                fullname: fullname,
                type: type,
            });
        })
    });
}