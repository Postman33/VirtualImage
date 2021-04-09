const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/category")
const passport = require("passport")
const upload = require("../middleware/upload")

//http://localhost:3000/api/auth/login
router.get("/",passport.authenticate("jwt",{session: false}),categoryController.getAll)
router.get("/:id",passport.authenticate("jwt",{session: false}),categoryController.getById)
router.delete("/:id",passport.authenticate("jwt",{session: false}),categoryController.removeById)
router.post("/",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
