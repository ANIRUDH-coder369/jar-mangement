const { monthlySales, todaySales } = require("../controller/chart.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.use(authenticate)

router.get("/monthly-sales", monthlySales)
router.get("/today-sales", todaySales)

module.exports = router
