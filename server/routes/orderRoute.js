const adminAuth = require("../middlewares/adminAuth")
const userAuth = require("../middlewares/auth")
const express = require("express")
const{allOrders,placeOrder,verifyRazorpay,placeOrderRazorpay,placeOrderStripe,userOrders,updateStatus, verifyStripe} = require("../controllers/ordersController") 
const orderRouter = express.Router()

// admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features 
orderRouter.post('/place',userAuth,placeOrder)
orderRouter.post('/stripe',userAuth,placeOrderStripe)
orderRouter.post('/razorpay',userAuth,placeOrderRazorpay)

// User Feature
orderRouter.post('/userorders',userAuth,userOrders)

// verify payment 
orderRouter.post('/verifyStripe',userAuth,verifyStripe)
orderRouter.post(
  "/verifyRazorpay",
  userAuth,
  verifyRazorpay
);

module.exports = orderRouter
