const Customer = require('../model/customer.model.js')

exports.create = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body
        const customer = await Customer.create({
            vendorId: req.user.id,
            name, email, phone, address,
        })
        res.status(201).json({ message: 'Customer created', customer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getAll = async (req, res) => {
    try {
        const customers = await Customer.find({ vendorId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ customers })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, vendorId: req.user.id })
        if (!customer) return res.status(404).json({ message: 'Customer not found' })
        res.status(200).json({ customer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.update = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.user.id },
            { name, email, phone, address },
            { new: true }
        )
        if (!customer) return res.status(404).json({ message: 'Customer not found' })
        res.status(200).json({ message: 'Customer updated', customer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.delete = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id })
        if (!customer) return res.status(404).json({ message: 'Customer not found' })
        res.status(200).json({ message: 'Customer deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.block = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.user.id },
            { isBlocked: true },
            { new: true }
        )
        if (!customer) return res.status(404).json({ message: 'Customer not found' })
        res.status(200).json({ message: 'Customer blocked', customer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.unblock = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.user.id },
            { isBlocked: false },
            { new: true }
        )
        if (!customer) return res.status(404).json({ message: 'Customer not found' })
        res.status(200).json({ message: 'Customer unblocked', customer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
