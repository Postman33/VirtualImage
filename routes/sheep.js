const express = require("express")
const router = express.Router()
const sheepController = require("../controllers/sheep")
const passport = require("passport")
const upload = require("../middleware/upload")


router.get("/",sheepController.getAll)
router.get("/:id",sheepController.getById)
router.get("/:id/stats",sheepController.getStats)
router.post("/",sheepController.create)
router.patch("/:id",sheepController.update)
router.delete("/:id",sheepController.delete)
router.delete("/",sheepController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
