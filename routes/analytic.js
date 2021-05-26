const express = require("express")
const router = express.Router()
const authController = require("../controllers/analytic")
const passport = require("passport")

//http://localhost:3000/api/auth/login
router.get("/overview",passport.authenticate("jwt",{session: false}),authController.overview)
router.get("/analytics",passport.authenticate("jwt",{session: false}),authController.analytic)


module.exports = router
