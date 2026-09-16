const orderModel = require("../models/ordersModel");
const userModel = require("../models/userModel");
const Stripe = require("stripe");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const currency = "inr";
const deliveryCharge = 10;

// Place order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: "Order Placed",
    });
  } catch (error) {
    console.error("COD Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Place order using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const origin = req.headers.origin;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }
    if (!origin) {
      return res.status(400).json({ success: false, message: "Frontend origin is missing" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { success, orderId } = req.body;
  const userId = req.userId;

  try {
    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.status(200).json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("Verify Stripe Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Place order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment Signature
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all orders for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("All Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch user orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });

    return res.status(200).json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};