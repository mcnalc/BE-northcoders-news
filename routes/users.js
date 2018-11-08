const userRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");

userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
