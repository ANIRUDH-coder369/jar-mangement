const { login } = require("../controller/auth.controller.js")

const router = require("express").Router()

router
    .post("/login", login)

module.exports = router
