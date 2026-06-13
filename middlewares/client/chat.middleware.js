const User = require('../../models/user.model')

module.exports.roomChat = async (req, res, next) => {
    const roomChatID = req.params.roomChatID;
    const userID = res.locals.user.id;
    const existUserInRoomChat = await User.findOne({
        _id: userID,
        "listFriend.room_chat_id" : roomChatID,
        deleted: false,
    }) 
    if(existUserInRoomChat){
        next();
    }
    else{
        res.redirect('/404')
    }
}