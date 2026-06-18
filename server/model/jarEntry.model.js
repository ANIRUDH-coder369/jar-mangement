const mongoose = require('mongoose')

const jarEntrySchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "vendor", required: true },
    date: { type: String, required: true },
    noOfJars: { type: Number, required: true },
    pricing: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model("jarEntry", jarEntrySchema)
