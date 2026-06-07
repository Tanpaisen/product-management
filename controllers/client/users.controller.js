const User = require('../../models/user.model')

const usersSocker = require('../../socket/client/users.socket')

// [GET /users/not-friend]
module.exports.notFriend = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({_id: myUserID})
    const requestsFriend = user.requestsFriend;
    const listFriend = user.listFriend.map(friend => friend.userID);
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            {_id: {$ne: myUserID}},
            {_id: {$nin: requestsFriend}},
            {_id: {$nin: listFriend}}
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/not-friend',{
        pageTitle: 'Danh sách người dùng',
        users: users
    })
}

// [GET /users/requests]
module.exports.requests = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({_id: myUserID})
    const requestsFriend = user.requestsFriend;
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            {_id: {$ne: myUserID}},
            {_id: {$in: requestsFriend}}
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/requests',{
        pageTitle: 'Lời mời đã gửi',
        users: users
    })
}

// [GET /users/accept]
module.exports.accept = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({_id: myUserID})
    const acceptsFriend = user.acceptsFriend;
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            {_id: {$ne: myUserID}},
            {_id: {$in: acceptsFriend}}
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/accepts',{
        pageTitle: 'Lời mời kết bạn',
        users: users
    })
}