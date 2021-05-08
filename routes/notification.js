const express = require("express")
const router = express.Router()
const notify = require("../controllers/notification")
const authController = require("../controllers/auth")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",passport.authenticate("jwt",{session: false}),authController.allowTo("admin"),notify.getAll)
router.post("/",passport.authenticate("jwt",{session: false}),authController.allowTo("admin"),notify.saveAll)

// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)

module.exports = router
