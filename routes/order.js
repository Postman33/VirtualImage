const express = require("express")
const router = express.Router()
const authController = require("../controllers/order")

const passport = require("passport")

router.post("/",passport.authenticate("jwt",{session: false}),authController.create)
router.get("/",passport.authenticate("jwt",{session: false}),authController.getAll)


module.exports = router
