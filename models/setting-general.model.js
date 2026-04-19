const mongoose = require('mongoose');

const settingGeneralShema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    copyright: String,
    phone: String,
    email: String
}, {
    timestamps: true
});
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralShema, 'settings-general');

module.exports = SettingGeneral;