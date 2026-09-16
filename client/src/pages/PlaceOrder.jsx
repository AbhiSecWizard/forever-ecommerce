import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    products,
    getCartAmount,
    delivery_fee,
    setCartItems,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onHandleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Initialize Razorpay checkout modal
  const initPay = (order, orderId) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,

      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["qr", "intent", "collect"],
                },
              ],
            },
          },
          sequence: ["block.upi"],
          preferences: {
            show_default_blocks: true,
          },
        },
      },

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            { ...response, orderId },
            { headers: { token } }
          );

          if (data.success) {
            toast.success("Payment Successful!");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(data.message || "Verification failed");
          }
        } catch (error) {
          console.error("Razorpay Verification Error:", error);
          toast.error(
            error.response?.data?.message || "Verification Failed"
          );
        }
      },

      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },

      theme: {
        color: "#3399cc",
      },

      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      toast.error(response.error?.description || "Payment Failed");
    });

    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (isPlacingOrder) return; // guard against double submit

    // Basic phone validation (10 digit Indian number)
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];

          if (quantity > 0) {
            const productInfo = products.find(
              (product) => product._id === productId
            );

            if (productInfo) {
              const item = structuredClone(productInfo);
              item.size = size;
              item.quantity = quantity;
              orderItems.push(item);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setIsPlacingOrder(false);
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (method === "cod") {
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Order placed successfully");
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      } else if (method === "stripe") {
        const responseStripe = await axios.post(
          `${backendUrl}/api/order/stripe`,
          orderData,
          { headers: { token } }
        );

        if (responseStripe.data.success) {
          const { session_url } = responseStripe.data;
          window.location.replace(session_url);
        } else {
          toast.error(responseStripe.data.message || "Stripe payment failed");
        }
      } else if (method === "razorpay") {
        const responseRazorpay = await axios.post(
          `${backendUrl}/api/order/razorpay`,
          orderData,
          { headers: { token } }
        );

        if (responseRazorpay.data.success) {
          initPay(responseRazorpay.data.order, responseRazorpay.data.orderId);
        } else {
          toast.error(responseRazorpay.data.message);
        }
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <Title text1="DELIVERY" text2="INFORMATION" />

        <div className="flex gap-3">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onHandleChange}
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onHandleChange}
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onHandleChange}
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />

        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={onHandleChange}
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />

        <div className="flex gap-3">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onHandleChange}
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onHandleChange}
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={onHandleChange}
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={onHandleChange}
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onHandleChange}
          placeholder="Phone"
          maxLength={10}
          pattern="\d{10}"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full sm:max-w-[450px] mt-8">
        <CartTotal />

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex flex-col lg:flex-row gap-3 mt-5">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-500" : ""
                }`}
              />
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-500" : ""
                }`}
              />
              <img
                src={assets.razorpay_logo}
                className="h-5 mx-4"
                alt="Razorpay"
              />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <span
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                }`}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={isPlacingOrder}
              className="bg-black text-white px-16 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;