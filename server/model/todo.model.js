const mongoose = require('mongoose')

module.exports = mongoose.model("todo", new mongoose.Schema({
    task: { type: String, required: true },
    desc: { type: String, required: true },
    priority: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true }))

