const express = require("express")
const router = express.Router()
const authController = require("../controllers/position")
const passport = require("passport")

//http://localhost:3000/api/auth/login
router.get("/:CategoryId",passport.authenticate("jwt",{session: false}),authController.getByCatId)
router.post("/",passport.authenticate("jwt",{session: false}),authController.create)

router.patch("/:id",passport.authenticate("jwt",{session: false}),authController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),authController.remove)


module.exports = router
