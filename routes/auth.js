const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")
const passport = require("passport")

//http://localhost:3000/api/auth/login
router.post("/login",authController.login)
router.post("/register",authController.register)
router.post("/getMyRole",passport.authenticate("jwt",{session: false}),authController.getMyRole)


module.exports = router
