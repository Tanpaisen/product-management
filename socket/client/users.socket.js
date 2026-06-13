const User = require('../../models/user.model');
const RoomChat = require('../../models/room.chat.model')
module.exports = (res) => {

    _io.once('connection', async (socket) => {
        //Hàm lấy số lượng lời mời kết bạn của B
        const updateRequestLength = async (userId) => {
            // Cập nhật giao diện số lượng lời mời kết bạn của B
            const userB = await User.findOne({ _id: userId })
            const requestLength = userB.acceptsFriend.length;
            _io.emit('SERVER_RETURN_REQUEST_LENGTH', {
                userId: userId,
                requestLength: requestLength
            })
            // End cập nhật giao diện số lượng lời mời kết bạn của B
        }
        //End Hàm lấy số lượng lời mời kết bạn của B

        // Khi A gửi yêu cầu kết bạn cho B
        socket.on('CLIENT_ADD_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của A
            const userId = userID; //ID của B

            const exitIDAinB = await User.findOne({
                _id: userId,
                acceptsFriend: myUserID
            })
            if (!exitIDAinB) {
                //Thêm id của A vào acceptsFriend của B
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptsFriend: myUserID }
                })
            }
            const exitIDBinA = await User.findOne({
                _id: myUserID,
                requestsFriend: userId
            })
            if (!exitIDBinA) {
                //Thêm id của B vào requestsFriend của A
                await User.updateOne({
                    _id: myUserID
                }, {
                    $push: { requestsFriend: userId }
                })
            }

            // Cập nhật giao diện số lượng lời mời kết bạn của B
            await updateRequestLength(userId);
            // End cập nhật giao diện số lượng lời mời kết bạn của B

            //Hiển thị danh sách lời mời kết bạn mới của B
            const infoUserA = await User.findOne({ _id: myUserID }).select("fullname avatar id");
            socket.broadcast.emit('SERVER_RETURN_LIST_REQUEST_FRIEND', {
                userId: userId,
                infoUserA: infoUserA,
            })
            //End Hiển thị danh sách lời mời kết bạn mới của B

        })
        // End Khi A gửi yêu cầu kết bạn cho B

        // Khi A hủy yêu cầu kết bạn cho B
        socket.on('CLIENT_CANCEL_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của A
            const userId = userID; //ID của B

            const exitIDAinB = await User.findOne({
                _id: userId,
                acceptsFriend: myUserID
            })
            if (exitIDAinB) {
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptsFriend: myUserID }
                })
            }
            const exitIDBinA = await User.findOne({
                _id: myUserID,
                requestsFriend: userId
            })
            if (exitIDBinA) {
                //Xóa id của B khỏi requestsFriend của A
                await User.updateOne({
                    _id: myUserID
                }, {
                    $pull: { requestsFriend: userId }
                })
            }

            // Cập nhật giao diện số lượng lời mời kết bạn của B
            await updateRequestLength(userId);
            // End cập nhật giao diện số lượng lời mời kết bạn của B


            //Gửi id của A cho B
            socket.broadcast.emit('SERVER_RETURN_USER_ID_REQUEST', {
                userIdofB: userId,
                userIDofA: myUserID,
            })
            //End Gửi id của A cho B

        })
        // End Khi A hủy yêu cầu kết bạn cho B

        // Khi B từ chối yêu cầu kết bạn cho A
        socket.on('CLIENT_REFUSE_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của B
            const userId = userID; //ID của A

            const exitIDAinB = await User.findOne({
                _id: myUserID,
                acceptsFriend: userID
            })
            if (exitIDAinB) {
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: myUserID
                }, {
                    $pull: { acceptsFriend: userID }
                })
            }
            const exitIDBinA = await User.findOne({
                _id: userID,
                requestsFriend: myUserID
            })
            if (exitIDBinA) {

                //Xóa id của B khỏi requestsFriend của A
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestsFriend: myUserID }
                })
            }

            //Cập nhật số lượng lời mời kết bạn mới của B
            await updateRequestLength(myUserID);
            //End Cập nhật số lượng lời mời kết bạn mới của B
        })
        // End Khi B từ chối yêu cầu kết bạn cho A

        // Khi B chấp nhận yêu cầu kết bạn cho A
        socket.on('CLIENT_ACCEPT_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của B
            const userId = userID; //ID của A

            // kiểm tra tồn tại user
            const existIDAinB = await User.findOne({
                _id: myUserID,
                acceptsFriend: userID
            })
            const existIDBinA = await User.findOne({
                _id: userID,
                requestsFriend: myUserID
            })
            // End kiểm tra tồn tại user

            let roomChat
            if (existIDAinB && existIDBinA) {
                const dataRoom = {
                    users: [{
                        typeRoom: 'friend',
                        userID: userID,
                        role: 'superAdmin',
                    },
                    {
                        typeRoom: 'friend',
                        userID: myUserID,
                        role: 'superAdmin'
                    }]
                }
                roomChat = new RoomChat(dataRoom)
                await roomChat.save();
            }

            if (existIDAinB) {
                //Thêm user_id,room_chat_id của A vào friendList của B
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: myUserID
                }, {
                    $pull: { acceptsFriend: userID },
                    $push: {
                        listFriend: {
                            userID: userID,
                            room_chat_id: roomChat.id,
                        },
                    }
                })
            }

            if (existIDBinA) {
                //Thêm user_id,room_chat_id của B vào friendList của A
                //Xóa id của B khỏi requestsFriend của A
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestsFriend: myUserID },
                    $push: {
                        listFriend: {
                            userID: myUserID,
                            room_chat_id: roomChat.id,
                        },
                    }
                })
            }

            //Cập nhật số lượng lời mời kết bạn mới của B
            await updateRequestLength(myUserID);
            //End Cập nhật số lượng lời mời kết bạn mới của B
        })
        //End Khi B chấp nhận yêu cầu kết bạn cho A
    });
}