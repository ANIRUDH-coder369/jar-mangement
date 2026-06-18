require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./model/user.model.js')

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)

        const existing = await User.findOne({ email: "admin@gmail.com" })
        if (existing) {
            console.log("Admin already exists, skipping seed.")
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash("admin@123", 10)

        await User.create({
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
        })

        console.log("Admin seeded successfully: admin@gmail.com")
        process.exit(0)
    } catch (error) {
        console.error("Seed failed:", error)
        process.exit(1)
    }
}

seed()
