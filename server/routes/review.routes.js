const { create, getAll, check } = require("../controller/review.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.post("/", authenticate, create)
router.get("/", authenticate, getAll)
router.get("/check", authenticate, check)

module.exports = router
