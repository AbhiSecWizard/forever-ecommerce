const mongoose = require("mongoose")


async function connectDb (){

    try {
       await   mongoose.connect(`${process.env.MONGODB_URI}forever_ecom`)
        console.log("Database connected")
    } catch (error) {
        console.log("DATABASE ERROR",error)
    }

}

module.exports = connectDb