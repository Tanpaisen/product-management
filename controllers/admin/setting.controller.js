const SettingGeneral = require('../../models/setting-general.model')
//[GET] /admin/setting/general
module.exports.settingGeneral = async (req, res) => {
    const records = await SettingGeneral.findOne()
    res.render('admin/pages/settings/general', {
        pageTitle: 'Cài đặt chung',
        records: records,
    })
}

//[POST] /admin/setting/general
module.exports.settingGeneralPost = async (req, res) => {
    const settingsGeneral = await SettingGeneral.findOne()
    if (!settingsGeneral) {
        const records = new SettingGeneral(req.body)
        await records.save()
    }
    else{
        await SettingGeneral.updateOne({_id: settingsGeneral.id},req.body)
    }
    res.redirect('back')
}