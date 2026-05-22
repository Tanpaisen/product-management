const User = require('../../models/user.model')

// [GET /users/not-friend]
module.exports.index = async (req, res) => {
    const users = await User.find({}).select('id fullname avatar')
    console.log(users)
    res.render('client/pages/users/not-friend',{
        pageTitle: 'Danh sách người dùng',
        users: users
    })
}