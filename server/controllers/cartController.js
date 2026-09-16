const userModel = require("../models/userModel")
const addToCart = async (req, res) => {
  try {

    const { itemId, size } = req.body;

    const userId = req.userId;

    console.log("USER ID:", userId);
    console.log("ITEM ID:", itemId);
    console.log("SIZE:", size);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized"
      });
    }

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required"
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {

      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }

    } else {

      cartData[itemId] = {
        [size]: 1
      };

    }

    console.log("FINAL CART:", cartData);

    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          cartData: cartData
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Added To Cart"
    });

  } catch (error) {

    console.log("ADD CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const userId = req.userId;

    console.log("USER ID:", userId);
    console.log("ITEM ID:", itemId);
    console.log("SIZE:", size);
    console.log("QUANTITY:", quantity);

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          cartData: cartData
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Cart Updated"
    });

  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const cartData = userData.cartData || {};

    return res.status(200).json({
      success: true,
      cartData: cartData
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {addToCart,updateCart,getUserCart}