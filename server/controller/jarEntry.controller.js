const JarEntry = require('../model/jarEntry.model.js')

exports.create = async (req, res) => {
    try {
        const { customerId, date, noOfJars, pricing } = req.body
        const entry = await JarEntry.create({
            customerId,
            vendorId: req.user.id,
            date,
            noOfJars,
            pricing,
        })
        res.status(201).json({ message: 'Entry created', entry })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getAll = async (req, res) => {
    try {
        const { customerId } = req.query
        const filter = { vendorId: req.user.id }
        if (customerId) filter.customerId = customerId
        const entries = await JarEntry.find(filter).sort({ createdAt: -1 })
        res.status(200).json({ entries })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.update = async (req, res) => {
    try {
        const { date, noOfJars, pricing } = req.body
        const entry = await JarEntry.findOneAndUpdate(
            { _id: req.params.id, vendorId: req.user.id },
            { date, noOfJars, pricing },
            { new: true }
        )
        if (!entry) return res.status(404).json({ message: 'Entry not found' })
        res.status(200).json({ message: 'Entry updated', entry })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.delete = async (req, res) => {
    try {
        const entry = await JarEntry.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id })
        if (!entry) return res.status(404).json({ message: 'Entry not found' })
        res.status(200).json({ message: 'Entry deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
