const express = require("express")
const router = express.Router()
const authController = require("../controllers/analytic")
const passport = require("passport")

//http://localhost:3000/api/auth/login
router.get("/overview",authController.overview)
router.get("/analytics",authController.analytic)


module.exports = router
