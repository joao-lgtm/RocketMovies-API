const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload")
const UserController = require("../controllers/userController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAutheticated = require("../middleware/ensureAutheticated");

const userRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const userController = new UserController();
const userAvatarController = new UserAvatarController();

userRoutes.post("/", userController.create);
userRoutes.put("/",ensureAutheticated,userController.update);
userRoutes.patch("/avatar", ensureAutheticated, upload.single("avatar"), userAvatarController.update)


module.exports = userRoutes;