const { getAllVendors, blockVendor, unblockVendor } = require("../controller/superadmin.controller.js")
const { authenticate } = require("../middleware/auth.middleware.js")

const router = require("express").Router()

router.use(authenticate)

router
    .get("/vendors", getAllVendors)
    .patch("/vendors/:id/block", blockVendor)
    .patch("/vendors/:id/unblock", unblockVendor)

module.exports = router
