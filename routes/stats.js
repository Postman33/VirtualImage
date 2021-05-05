const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")
const statsController = require("../controllers/stats")
const passport = require("passport")

//http://localhost:3000/api/auth/login

router.post("/stats",passport.authenticate("jwt",{session: false}),statsController.getPeriodStats)
router.post("/structure",passport.authenticate("jwt",{session: false}),statsController.getStructureStats)


module.exports = router
