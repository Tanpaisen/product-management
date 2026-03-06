const mongoose = require('mongoose');
const generate = require('../helper/generate');

const accountShema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    deleteAt: Date,
}, {
    timestamps: true
});
const Account = mongoose.model('Account', accountShema, 'accounts');

module.exports = Account;