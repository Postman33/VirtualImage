const express = require("express")
const router = express.Router()
const farmController = require("../controllers/farm")
const passport = require("passport")
const upload = require("../middleware/upload")

//http://localhost:3000/api/auth/login
router.get("/",farmController.getAll)
router.get("/:id",farmController.getById)
router.post("/",farmController.create)
router.patch("/:id",farmController.update)
router.delete("/:id",farmController.delete)
router.delete("/",farmController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
