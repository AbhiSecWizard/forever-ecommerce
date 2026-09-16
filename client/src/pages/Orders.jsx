import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const {
    backendUrl,
    token,
    currency,
  } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  // Fetch user orders
  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      console.log("Orders Response:", response.data);

      if (response.data.success) {
        const allOrders = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrders.push({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrders.reverse());
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("Load Orders Error:", error);

      console.log(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // Load orders when token changes
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 pb-20">
      {/* Page Title */}
      <div className="mb-8 text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* Orders */}
      <div className="space-y-5">
        {orderData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={`${item.orderId}-${index}`}
              className="
                border border-gray-200
                rounded-lg
                p-4 sm:p-6
                bg-white
                hover:shadow-md
                transition-all duration-300
              "
            >
              <div
                className="
                  flex flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-6
                "
              >
                {/* Product Information */}
                <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div
                    className="
                      w-20 h-24
                      sm:w-24 sm:h-28
                      shrink-0
                      bg-gray-100
                      rounded-md
                      overflow-hidden
                    "
                  >
                    <img
                      src={item.image?.[0]}
                      alt={item.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Order #{item.orderId}
                      </p>
                    </div>

                    {/* Price / Quantity / Size */}
                    <div
                      className="
                        flex flex-wrap
                        items-center
                        gap-x-4 gap-y-2
                        mt-3
                        text-sm text-gray-600
                      "
                    >
                      <p>
                        <span className="text-gray-400">
                          Price:
                        </span>{" "}
                        <span className="font-medium text-gray-800">
                          {currency}
                          {item.price}
                        </span>
                      </p>

                      <p>
                        <span className="text-gray-400">
                          Qty:
                        </span>{" "}
                        {item.quantity}
                      </p>

                      <p>
                        <span className="text-gray-400">
                          Size:
                        </span>{" "}
                        {item.size}
                      </p>
                    </div>

                    {/* Order Date */}
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Ordered on{" "}
                      <span className="text-gray-700">
                        {new Date(item.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </p>

                    {/* Payment Method */}
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Payment Method:{" "}
                      <span className="text-gray-700 font-medium">
                        {item.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status + Track Button */}
                <div
                  className="
                    flex flex-col
                    sm:flex-row
                    sm:items-center
                    gap-4
                    lg:min-w-[280px]
                    lg:justify-end
                  "
                >
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                    <span className="text-sm font-medium text-gray-700">
                      {item.status}
                    </span>
                  </div>

                  {/* Track Order */}
                  <button
                    type="button"
                    className="
                      border border-gray-300
                      px-5 py-2.5
                      rounded-md
                      text-sm font-medium
                      text-gray-700
                      hover:bg-black
                      hover:text-white
                      hover:border-black
                      transition-all duration-300
                    "
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;