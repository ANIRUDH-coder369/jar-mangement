const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "vendor", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("customer", customerSchema)
