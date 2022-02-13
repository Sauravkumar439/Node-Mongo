const express = require("express");
const router = express.Router();

const controller = require("../controller/controller");
const upload = require("../middleware/upload");
const checktoken = require('../auth/authenticator');

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh-token", controller.refreshToken);
router.get("/",checktoken, controller.index);
router.post("/show", checktoken,controller.show);
router.post("/store", checktoken,upload.single("avtar"), controller.store);
router.patch("/update",checktoken, controller.update);
router.delete("/delete", checktoken,controller.destroy);

module.exports = router;
