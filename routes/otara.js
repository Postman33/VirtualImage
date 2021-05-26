const express = require("express")
const router = express.Router()
const otaraController = require("../controllers/otara")
const passport = require("passport")
const upload = require("../middleware/upload")

//http://localhost:3000/api/auth/login
router.get("/",passport.authenticate("jwt",{session: false}),otaraController.getAll)
router.get("/:id",passport.authenticate("jwt",{session: false}),otaraController.getById)
router.post("/",passport.authenticate("jwt",{session: false}),otaraController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),otaraController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),otaraController.delete)
router.delete("/",passport.authenticate("jwt",{session: false}),otaraController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
