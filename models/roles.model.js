const mmongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    title: String,
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deleteAt: Date,
}, {
    timestamps: true
});
const Role = mongosee.model('Role', roleSchema, 'role')