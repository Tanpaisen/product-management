const User = require('../../models/user.model')
const RoomChat = require('../../models/room.chat.model')

//[GET] /rooms-chat
module.exports.index = (req, res) => {
    res.render('client/pages/room-chats/index.pug', {
        pageTitle: 'Nhóm chat'
    })
}

//[GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const myID = res.locals.user.id;

    const user = await User.findOne({
        _id: myID,
        deleted: false,
    })

    const listFriend = user.listFriend

    for (const user of listFriend) {
        const infoUser = await User.findOne({
            _id: user.userID,
            deleted: false
        }).select('fullname avatar')
        user.infoUser = infoUser
    }

    res.render('client/pages/room-chats/create.pug', {
        pageTitle: 'Tạo nhóm chat',
        listFriend: listFriend
    })
}

//[POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const roomName = req.body.roomName;
    const userIDs = req.body.userIDs;

    const dataRoom = {
        roomName: roomName,
        avatar: 'https://robohash.org/hicveldicta.png',
        typeRoom: 'group',
        users: []
    }

    for (const item of userIDs) {
        dataRoom.users.push({
            userID: item,
            role: 'user'
        })
    }

    dataRoom.users.push({
        userID: res.locals.user.id,
        role: 'superAdmin'
    })

    const roomChat = new RoomChat(dataRoom)
    roomChat.save();

    res.redirect(`/chat/${roomChat.id}`)
}