const mongoose = require('mongoose')
const JarEntry = require('../model/jarEntry.model.js')

exports.monthlySales = async (req, res) => {
    try {
        const data = await JarEntry.aggregate([
            { $match: { vendorId: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $group: {
                    _id: { $substr: ["$date", 0, 7] },
                    totalJars: { $sum: "$noOfJars" },
                    totalRevenue: { $sum: "$pricing" },
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalJars: 1,
                    totalRevenue: 1,
                }
            }
        ])
        res.status(200).json({ data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.todaySales = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split("T")[0]
        const result = await JarEntry.aggregate([
            {
                $match: {
                    vendorId: new mongoose.Types.ObjectId(req.user.id),
                    date,
                }
            },
            {
                $group: {
                    _id: null,
                    totalJars: { $sum: "$noOfJars" },
                    totalRevenue: { $sum: "$pricing" },
                }
            }
        ])
        const totalJars = result.length > 0 ? result[0].totalJars : 0
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0
        res.status(200).json({ totalJars, totalRevenue, date })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}
