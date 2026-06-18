const { create, getAll, update, delete: deleteEntry } = require("../controller/jarEntry.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.use(authenticate)

router
    .post("/", create)
    .get("/", getAll)
    .put("/:id", update)
    .delete("/:id", deleteEntry)

module.exports = router
