const express = require("express")
const router = express.Router()
const sheepController = require("../controllers/sheep")
const passport = require("passport")
const  authController = require("../controllers/auth")
router.get("/",passport.authenticate("jwt",{session: false}),sheepController.getAll);
router.get("/:id",passport.authenticate("jwt",{session: false}),sheepController.getById);
router.get("/:id/stats",passport.authenticate("jwt",{session: false}),sheepController.getStats);
router.post("/",passport.authenticate("jwt",{session: false}),sheepController.create);
router.patch("/:id",passport.authenticate("jwt",{session: false}),sheepController.update);
router.delete("/:id",passport.authenticate("jwt",{session: false}),sheepController.delete);
router.delete("/",passport.authenticate("jwt",{session: false}),authController.allowTo("admin"),
    sheepController.clearAll);

module.exports = router
