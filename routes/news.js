const express = require("express")
const router = express.Router()
const newsController = require("../controllers/news")
const passport = require("passport")
const upload = require("../middleware/upload")

router.get("/",newsController.getAll)
router.get("/:id",newsController.getById)
router.post("/keywords",newsController.getByKeywords)
router.post("/date",newsController.getByDate)
router.post("/",passport.authenticate("jwt",{session: false}),newsController.create)
router.patch("/:id",passport.authenticate("jwt",{session: false}),newsController.update)
router.delete("/:id",passport.authenticate("jwt",{session: false}),newsController.delete)
router.delete("/",passport.authenticate("jwt",{session: false}),newsController.clearAll)
// router.get("/:id",passport.authenticate("jwt",{session: false}),farm.getById)
// router.delete("/:id",passport.authenticate("jwt",{session: false}),farm.removeById)
// router.patch("/:id",passport.authenticate("jwt",{session: false}),upload.single('image'),categoryController.update)


module.exports = router
