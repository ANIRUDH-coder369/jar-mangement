const Vendor = require('../model/vendor.model.js')

const planLabels = {
    free: 'Free',
    onemin: '1 Minute',
    monthly: '1 Month',
    halfyearly: '6 Months',
    yearly: '1 Year',
}

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().select('-password').sort({ createdAt: -1 })

        const now = new Date()

        const enhanced = vendors.map(v => {
            const obj = v.toObject()

            let planStatus = 'no_plan'
            let planDaysRemaining = null
            let planDaysExpired = null

            if (obj.plan && obj.planEndDate) {
                const endDate = new Date(obj.planEndDate)
                const diffMs = endDate.getTime() - now.getTime()
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

                if (diffMs > 0) {
                    planStatus = 'active'
                    planDaysRemaining = diffDays
                } else {
                    planStatus = 'expired'
                    planDaysExpired = Math.abs(diffDays)
                }
            }

            return {
                ...obj,
                planStatus,
                planLabel: planLabels[obj.plan] || null,
                planDaysRemaining,
                planDaysExpired,
            }
        })

        res.status(200).json({ vendors: enhanced })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.blockVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { isBlocked: true },
            { new: true }
        ).select('-password')
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
        res.status(200).json({ message: 'Vendor blocked', vendor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.unblockVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { isBlocked: false },
            { new: true }
        ).select('-password')
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
        res.status(200).json({ message: 'Vendor unblocked', vendor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
