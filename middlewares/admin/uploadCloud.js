const uploadtoCloud = require('../../helper/upLoadtoCloud');

module.exports.upload = async (req, res, next) => {
    if (req.file) {
        let link =  await uploadtoCloud(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
    next();

}