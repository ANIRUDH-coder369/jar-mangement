const { create, getAll, getById, update, delete: deleteCustomer, block, unblock } = require("../controller/customer.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.use(authenticate)

router
    .post("/", create)
    .get("/", getAll)
    .get("/:id", getById)
    .put("/:id", update)
    .delete("/:id", deleteCustomer)
    .patch("/:id/block", block)
    .patch("/:id/unblock", unblock)

module.exports = router
