const express = require("express")
const router = express.Router()
const otaraController = require("../controllers/otara")
const passport = require("passport")
const upload = require("../middleware/upload")

//http://localhost:3000/api/auth/login
router.get("/",otaraController.getAll)
router.get("/:id",otaraController.getById)
router.post("/",otaraController.create)
router.patch("/:id",otaraController.update)
router.delete("/:id",otaraController.delete)
router.delete("/",otaraController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
