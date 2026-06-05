const User = require('../../models/user.model');

module.exports = (res) => {

    _io.once('connection', async (socket) => {
        // Khi A gửi yêu cầu kết bạn cho B
        socket.on('CLIENT_ADD_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của A
            const userId = userID; //ID của B

            const exitsUser = await User.findOne({ requestsFriend: userId })
            if (!exitsUser) {
                //Thêm id của A vào acceptsFriend của B
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptsFriend: myUserID }
                })

                //Thêm id của B vào requestsFriend của A
                await User.updateOne({
                    _id: myUserID
                }, {
                    $push: { requestsFriend: userId }
                })
            }
        })
        // End Khi A gửi yêu cầu kết bạn cho B

        // Khi A hủy yêu cầu kết bạn cho B
        socket.on('CLIENT_CANCEL_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của A
            const userId = userID; //ID của B
            console.log(userID, myUserID)

            const exitsUser = await User.findOne({ requestsFriend: userId })
            if (exitsUser) {
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptsFriend: myUserID }
                })

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

            const exitsUser = await User.findOne({ requestsFriend: myUserID })
            if (exitsUser) {
                //Xóa id của A khỏi acceptsFriend của B
                await User.updateOne({
                    _id: myUserID
                }, {
                    $pull: { acceptsFriend: userID }
                })

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

            const exitsUser = await User.findOne({ requestsFriend: myUserID })
            

            if (exitsUser) {
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