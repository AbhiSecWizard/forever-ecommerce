require("dotenv/config")
const express = require("express")
const cors = require("cors")
const connectDb = require("./config/mongodb")
const connectCloudinary = require("./config/cloudinary")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const cartRouter = require("./routes/cartRoutes")
const orderRouter = require("./routes/orderRoute")

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
res.send("API WORKING")
})  
   
app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use(cors({
    origin:["https://forever-ecommerce-frontend-tt2k.onrender.com"],
    credentials:true
}))

app.listen(port,()=>console.log("Server started on PORT: " + port))
connectDb()
connectCloudinary()
