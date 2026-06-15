const RoomChat = require('../../models/room.chat.model')

module.exports.roomChat = async (req, res, next) => {
    const roomChatID = req.params.roomChatID;
    const userID = res.locals.user.id;
    const existUserInRoomChat = await RoomChat.findOne({
        _id: roomChatID,
        "users.userID" : userID,
        deleted: false,
    }) 
    if(existUserInRoomChat){
        next();
    }
    else{
        res.redirect('/404')
    }
}