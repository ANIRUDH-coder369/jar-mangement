const Vendor = require('../model/vendor.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getPlanDurationMs = (plan) => {
    switch (plan) {
        case 'free': return 10 * 24 * 60 * 60 * 1000
        case 'onemin': return 60 * 1000
        case 'monthly': return 30 * 24 * 60 * 60 * 1000
        case 'halfyearly': return 180 * 24 * 60 * 60 * 1000
        case 'yearly': return 365 * 24 * 60 * 60 * 1000
        default: return 0
    }
}

const getPlanPrice = (plan) => {
    switch (plan) {
        case 'monthly': return 500
        case 'halfyearly': return 2000
        case 'yearly': return 5000
        default: return 0
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const vendor = await Vendor.findOne({ email })
        if (!vendor) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, vendor.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        if (vendor.planEndDate && new Date(vendor.planEndDate) < new Date()) {
            vendor.plan = null
            vendor.planStartDate = null
            vendor.planEndDate = null
            vendor.isBlocked = true
            await vendor.save()
        }

        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor', username: vendor.username },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        )

        const hasActivePlan = vendor.planEndDate && new Date(vendor.planEndDate) > new Date()

        res.status(200).json({
            message: 'Login successful',
            token,
            vendor: {
                id: vendor._id,
                companyName: vendor.companyName,
                email: vendor.email,
                username: vendor.username,
            },
            plan: {
                type: hasActivePlan ? vendor.plan : null,
                startDate: vendor.planStartDate,
                endDate: vendor.planEndDate,
                hasActivePlan: !!hasActivePlan,
                hasUsedFreePlan: vendor.hasUsedFreePlan,
                isBlocked: vendor.isBlocked,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.register = async (req, res) => {
    try {
        const { companyName, address, contactNo, email, username, password } = req.body

        const existing = await Vendor.findOne({ $or: [{ email }, { username }] })
        if (existing) {
            return res.status(400).json({ message: 'Email or username already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const vendor = await Vendor.create({
            companyName,
            address,
            contactNo,
            email,
            username,
            password: hashedPassword,
        })

        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor', username: vendor.username },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'Registration successful',
            token,
            vendor: {
                id: vendor._id,
                companyName: vendor.companyName,
                email: vendor.email,
                username: vendor.username,
            },
            plan: {
                type: null,
                startDate: null,
                endDate: null,
                hasActivePlan: false,
                hasUsedFreePlan: false,
                isBlocked: false,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.selectPlan = async (req, res) => {
    try {
        const { plan } = req.body
        const validPlans = ['free', 'onemin', 'monthly', 'halfyearly', 'yearly']
        if (!validPlans.includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan selected' })
        }

        const vendor = await Vendor.findById(req.user.id)
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' })
        }

        if (plan === 'free') {
            if (vendor.hasUsedFreePlan) {
                return res.status(400).json({ message: 'Free plan already used' })
            }
            vendor.hasUsedFreePlan = true
        }

        const now = new Date()
        const durationMs = getPlanDurationMs(plan)
        const endDate = new Date(now.getTime() + durationMs)

        vendor.plan = plan
        vendor.planStartDate = now
        vendor.planEndDate = endDate
        vendor.isBlocked = false
        await vendor.save()

        res.status(200).json({
            message: `${plan} plan activated successfully`,
            plan: {
                type: vendor.plan,
                startDate: vendor.planStartDate,
                endDate: vendor.planEndDate,
                hasActivePlan: true,
                hasUsedFreePlan: vendor.hasUsedFreePlan,
                isBlocked: false,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getPlanStatus = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id)
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' })
        }

        const hasActivePlan = vendor.planEndDate && new Date(vendor.planEndDate) > new Date()

        res.status(200).json({
            plan: {
                type: hasActivePlan ? vendor.plan : null,
                startDate: vendor.planStartDate,
                endDate: vendor.planEndDate,
                hasActivePlan: !!hasActivePlan,
                hasUsedFreePlan: vendor.hasUsedFreePlan,
                isBlocked: vendor.isBlocked,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.expirePlan = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id)
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' })
        }

        const isExpired = vendor.planEndDate && new Date(vendor.planEndDate) <= new Date()

        if (isExpired) {
            vendor.plan = null
            vendor.planStartDate = null
            vendor.planEndDate = null
            vendor.isBlocked = true
            await vendor.save()
        }

        res.status(200).json({
            message: isExpired ? 'Plan expired' : 'Plan still active',
            plan: {
                type: isExpired ? null : vendor.plan,
                startDate: isExpired ? null : vendor.planStartDate,
                endDate: isExpired ? null : vendor.planEndDate,
                hasActivePlan: !isExpired,
                hasUsedFreePlan: vendor.hasUsedFreePlan,
                isBlocked: isExpired ? true : vendor.isBlocked,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
