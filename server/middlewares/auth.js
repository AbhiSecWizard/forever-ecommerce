// const jwt = require("jsonwebtoken")

// const authUser = async (req,res,next)=>{
// const {token} = req.headers;
// if(!token){
//     return res.status(400).json({
//         success:false,
//         message:"Not Authorized Login Again"
//     })

// }try {
//     const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//     req.body.userId = token_decode.id
//     next()
// } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//         success:false,
//         message:error.message
//     })
// }
// }
// module.exports = authUser
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    try {

        console.log("HEADERS:", req.headers);
        console.log("TOKEN:", req.headers.token);

        const token = req.headers.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.userId = decoded.id;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authUser;