const User = require('../../models/user.model');

module.exports = (res) => {

    _io.once('connection', async (socket) => {
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
            const userB = await User.findOne({ _id: userId })
            const requestLength = userB.acceptsFriend.length;
            socket.broadcast.emit('SERVER_RETURN_REQUEST_LENGTH',{
                userId: userId,
                requestLength: requestLength
            })

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
            console.log(userID, myUserID)

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
        })
        // End Khi B từ chối yêu cầu kết bạn cho A

        // Khi B chấp nhận yêu cầu kết bạn cho A
        socket.on('CLIENT_ACCEPT_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của B
            const userId = userID; //ID của A

            const exitIDAinB = await User.findOne({ 
                _id: myUserID,
                acceptsFriend: userID 
            })
            if (exitIDAinB) {
                //Thêm user_id,room_chat_id của A vào friendList của B
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: myUserID
                }, {
                    $pull: { acceptsFriend: userID },
                    $push: {
                        listFriend: {
                            userID: userID,
                            // room_chat_id: String,
                        },
                    }
                })
            }
            const exitIDBinA = await User.findOne({ 
                _id: userID,
                requestsFriend: myUserID 
            })
            if (exitIDBinA) {
                //Thêm user_id,room_chat_id của B vào friendList của A
                //Xóa id của B khỏi requestsFriend của A
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestsFriend: myUserID },
                    $push: {
                        listFriend: {
                            userID: myUserID,
                            // room_chat_id: String,
                        },
                    }
                })
            }
        })
        //End Khi B chấp nhận yêu cầu kết bạn cho A
    });
}