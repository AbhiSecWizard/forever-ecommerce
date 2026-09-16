const express = require("express")
const productRouter = express.Router()
const {listProduct,addProduct,removeProduct,singleProduct} = require("../controllers/productController");
const upload = require("../middlewares/multer");
const adminAuth = require("../middlewares/adminAuth");

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouter.delete('/remove',adminAuth,removeProduct)
productRouter.get('/single',singleProduct)
productRouter.get('/list',listProduct)

module.exports = productRouter













