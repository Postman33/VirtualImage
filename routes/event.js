const express = require("express")
const router = express.Router()
const eventController = require("../controllers/event")
const authController = require("../controllers/auth")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",passport.authenticate("jwt",{session: false}),eventController.getAll)
router.get("/:id",passport.authenticate("jwt",{session: false}),eventController.getById)
router.post("/",passport.authenticate("jwt",{session: false}),eventController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),eventController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),eventController.delete)
router.delete("/",passport.authenticate("jwt",{session: false}),authController.allowTo("admin"),eventController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
