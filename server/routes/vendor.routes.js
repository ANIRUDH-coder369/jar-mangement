const { login, register, logout, selectPlan, getPlanStatus, expirePlan } = require("../controller/vendor.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router
    .post("/login", login)
    .post("/register", register)
    .post("/logout", logout)
    .post("/select-plan", authenticate, selectPlan)
    .get("/plan-status", authenticate, getPlanStatus)
    .post("/expire-plan", authenticate, expirePlan)

module.exports = router
