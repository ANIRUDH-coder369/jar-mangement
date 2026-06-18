const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    plan: { type: String, enum: ['free', 'onemin', 'monthly', 'halfyearly', 'yearly'], default: null },
    planStartDate: { type: Date, default: null },
    planEndDate: { type: Date, default: null },
    hasUsedFreePlan: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("vendor", vendorSchema)
