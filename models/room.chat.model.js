const mongoose = require('mongoose');
const generate = require('../helper/generate');

const roomChatSchema = new mongoose.Schema({
    roomName: String,
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
const RoomChat = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat');

module.exports = RoomChat;