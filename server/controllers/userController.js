const validator = require("validator");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


function generateToken (id){
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
}




const loginUser =async (req,res)=>{
try {
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
       return res.status(400).json({
            success:false,
            message:"User doesn't exists"
        })
    }
     
    const isMatch = await bcrypt.compare(password,user.password);
    if(isMatch){
        const token = generateToken(user._id)
       return res.status(200).json({
            success:true,
            token
        })
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })

    }
} catch (error){
       console.log(error)
       return res.status(500).json({
        success:false,
        message:error.message
      })
}
}

const registerUser = async(req,res)=>{
try {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields Are required"
        })
    }
    
    const exists =await User.findOne({email})
    if(exists){
       return res.json({
        success:false,
        message:"User already exists"
       })
    }
    
    if(!validator.isEmail(email)){
       return res.status(400).json({
        success:false,
        message:"Please Enter A Valid Email"
       })
    }
    if(password.length < 8){
        return res.json({
            success:false,
            message:"Please Enter a strong password"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser =await User.create({
          email,
          name,
          password:hashedPassword
    })

    const user = await newUser.save()
     
    const token = generateToken(user._id)
   return res.json({success:true,token})
} catch (error) {
     console.log(error)
     res.status(500).json({
        success:false,
        message:error
     })    
}    
}    
    
const adminLogin = async (req,res)=>{
     try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
           const token = jwt.sign(email+password,process.env.JWT_SECRET)
            return res.status(200).json({
                success:true,
                token
             })
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid Creadencials"
            })
        }
     } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
     }
}   
     
module.exports = {loginUser,registerUser,adminLogin}

