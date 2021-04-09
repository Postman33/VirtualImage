const express = require("express")
const router = express.Router()
const chabanController = require("../controllers/chaban")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",chabanController.getAll)
router.get("/:id",chabanController.getById)
router.post("/",chabanController.create)
router.patch("/:id",chabanController.update)
router.delete("/:id",chabanController.delete)
router.delete("/",chabanController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
