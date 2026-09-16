const productModel = require("../models/productModels")
const cloudinary = require("cloudinary").v2

// function for add product
const addProduct = async (req,res)=>{
try {

const {name,description,price,category,subCategory,sizes,bestseller} = req.body;
const image1 =req.files.image1 && req.files.image1[0];
const image2 =req.files.image2 && req.files.image2[0];
const image3 =req.files.image3 && req.files.image3[0];
const image4 =req.files.image4 && req.files.image4[0];

// undefined nahi vo send kr do array 
const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)


let imagesUrl = await Promise.all(images.map( async (item)=>{
       let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
       return result.secure_url
}))
const productData ={
   name,
   description,
   category,
   price:Number(price),
   subCategory,
   bestseller,
   bestseller : bestseller === 'true' ? true : false,
   sizes:JSON.parse(sizes),
   image:imagesUrl,
   date:Date.now()
}
console.log(productData)
// console.log(imagesUrl)
const product = new productModel(productData)

await product.save()
return res.status(200).json({
   success:true,
   message:"Product Added"
})

} catch (error) {
   return res.status(500).json({
    success:false,
    message:error.message
   })
}

}


// function for list product
const listProduct = async (req,res)=>{
   try {
      const products = await productModel.find({})
      return res.status(200).json({
         success:true,
         products      
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         message:error.message,
         success:false
      })
   }
}
// function for removing product
const removeProduct = async (req,res)=>{
try {
   await productModel.findByIdAndDelete(req.body.id)
 return  res.status(200).json({
      success:true,
      message:"Product Removed"
   })
  
} catch (error) {
   console.log(error)

   res.status(500).json({
      success:false,
      message:error.message
   })
}
}

// function for single product info
const singleProduct = async (req,res)=>{
try {
   const {productId} = req.body;
   const product = await productModel.findById(productId)
   res.json({
      success:true,
      product  
   })
} catch (error) {
   console.log(error)
   res.json({
      success:false,
      message:error.message
   })
}
}

module.exports = {addProduct,listProduct,removeProduct,singleProduct}











