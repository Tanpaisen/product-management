const mongoose = require('mongoose');
const generate = require('../helper/generate');

const roomChatSchema = new mongoose.Schema({
    title: String,

    avatar: String,
    statusOnline: String,
    status: String,
    typeRoom: String,
    users: [{
        userID: String,
        role: String,
    }],
    deleted: {
        type: Boolean,
        default: false,
    },
    deleteAt: Date,
}, {
    timestamps: true
});
const RoomChat = mongoose.model('RoomChat', userShema, 'rooms-chat');

module.exports = RoomChat;