const {loginUser,registerUser,adminLogin} = require("../controllers/userController")
const express = require("express");

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

module.exports = userRouter;


