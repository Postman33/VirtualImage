const express = require("express")
const router = express.Router()
const eventController = require("../controllers/event")
const authController = require("../controllers/auth")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",eventController.getAll)
router.get("/:id",eventController.getById)
router.post("/",eventController.create)
router.patch("/:id",eventController.update)
router.delete("/:id",eventController.delete)
router.delete("/",authController.allowTo("admin"),eventController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
