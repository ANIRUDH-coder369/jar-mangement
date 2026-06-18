require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

const CLIENT_URL = process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL || "https://jar-app.vercel.app"
    : process.env.CLIENT_URL || "http://localhost:3000"
const PORT = process.env.PORT || 5000

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' }
})

app.use(helmet())
app.use('/api/', limiter)
app.use(express.json({ limit: '10kb' }))
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))

app.use("/api/auth", require("./routes/auth.routes.js"))
app.use("/api/todo", require("./routes/todo.routes.js"))
app.use("/api/vendor", require("./routes/vendor.routes.js"))
app.use("/api/customer", require("./routes/customer.routes.js"))
app.use("/api/jar-entry", require("./routes/jarEntry.routes.js"))
app.use("/api/superadmin", require("./routes/superadmin.routes.js"))
app.use("/api/chart", require("./routes/chart.routes.js"))
app.use("/api/send-email", require("./routes/email.routes.js"))
app.use("/api/review", require("./routes/review.routes.js"))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('db connected')
        app.listen(PORT, () => {
            console.log('server running on port', PORT)
        })
    })
    .catch((err) => {
        console.error('db connection failed:', err.message)
        process.exit(1)
    })

module.exports = app