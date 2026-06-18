const Review = require('../model/review.model.js')

exports.create = async (req, res) => {
    try {
        const existing = await Review.findOne({ vendorId: req.user.id })
        if (existing) return res.status(400).json({ message: 'You have already submitted a review' })

        const { rating, text } = req.body
        const vendorName = req.user.username
        const review = await Review.create({
            vendorId: req.user.id,
            vendorName,
            rating,
            text,
        })
        res.status(201).json({ message: 'Review submitted', review })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.check = async (req, res) => {
    try {
        const existing = await Review.findOne({ vendorId: req.user.id })
        res.status(200).json({ hasReviewed: !!existing, review: existing || null })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getAll = async (req, res) => {
    try {
        const reviews = await Review.find({ vendorId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({ reviews })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
