const express = require("express")
const router = express.Router()
const chabanController = require("../controllers/chaban")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",passport.authenticate("jwt",{session: false}),chabanController.getAll)
router.get("/:id",passport.authenticate("jwt",{session: false}),chabanController.getById)
router.post("/",passport.authenticate("jwt",{session: false}),chabanController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),chabanController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),chabanController.delete)
router.delete("/",passport.authenticate("jwt",{session: false}),chabanController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
