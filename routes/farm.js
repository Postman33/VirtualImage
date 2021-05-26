const express = require("express")
const router = express.Router()
const farmController = require("../controllers/farm")
const passport = require("passport")
const upload = require("../middleware/upload")

//http://localhost:3000/api/auth/login
router.get("/",passport.authenticate("jwt",{session: false}),farmController.getAll)
router.get("/:id",passport.authenticate("jwt",{session: false}),farmController.getById)
router.post("/",passport.authenticate("jwt",{session: false}),farmController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),farmController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),farmController.delete)
router.delete("/",passport.authenticate("jwt",{session: false}),farmController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
