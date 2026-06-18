const { sendJarEmail } = require("../controller/email.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.use(authenticate)

router.post("/", sendJarEmail)

module.exports = router
