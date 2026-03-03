const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    title: String,
    description: {
        type: String,
        default: ""
    },
    permissions: Array,
    deleted: {
        type: Boolean,
        default: false,
    },
    deleteAt: Date,
}, {
    timestamps: true
});
const Role = mongoose.model('Role', roleSchema, 'role')

module.exports = Role;