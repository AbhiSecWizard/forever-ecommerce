import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { backendUrl, currency } from "../App";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: {
            token,
          },
        }
      );

      console.log("Orders Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Fetch Orders Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // Fetch orders when token changes
  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const statusHandler = async (event,orderId)=>{
      try {
        const response = await axios.post(backendUrl+'/api/order/status',{orderId,status:event.target.value},{headers:{token}})
        if(response.data.success){
          await fetchAllOrders()
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }      
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Orders</h3>

      <div className="space-y-5">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 p-5 rounded-lg"
            >
              {/* Order Items */}
              <div className="flex items-start gap-4 mb-5">
                <img
                  src={assets.parcel_icon}
                  alt="Order"
                  className="w-12 h-12"
                />

                <div className="flex-1">
                  {order.items.map((item) => (
                    <p
                      key={`${order._id}-${item._id || item.name}-${item.size}`}
                      className="text-sm text-gray-700 mb-1"
                    >
                      {item.name}{" "}
                      <span className="text-gray-500">
                        x {item.quantity}
                      </span>{" "}
                      <span className="text-gray-500">
                        Size: {item.size}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Customer Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h4 className="font-medium mb-2">
                    Delivery Address
                  </h4>

                  <p className="text-sm text-gray-700">
                    {order.address.firstName}{" "}
                    {order.address.lastName}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.address.street}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.address.city},{" "}
                    {order.address.state},{" "}
                    {order.address.country},{" "}
                    {order.address.zipcode}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Phone: {order.address.phone}
                  </p>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="font-medium mb-2">
                    Order Details
                  </h4>

                  <p className="text-sm text-gray-500">
                    Items: {order.items.length}
                  </p>

                  <p className="text-sm text-gray-500">
                    Method: {order.paymentMethod}
                  </p>

                  <p className="text-sm text-gray-500">
                    Payment:{" "}
                    <span
                      className={
                        order.payment
                          ? "text-green-600"
                          : "text-orange-500"
                      }
                    >
                      {order.payment ? "Done" : "Pending"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </p>

                  <p className="text-lg font-semibold mt-2">
                    {currency}
                    {order.amount}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Order Status
                  </p>

                  <select
                    value={order.status}
                    onChange={(event)=>statusHandler(event,order._id)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                  >
                    <option value="Order Placed">
                      Order Placed
                    </option>

                    <option value="Packing">
                      Packing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Out for delivery">
                      Out for delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>
                  </select>
                </div>

                <p className="text-sm text-gray-600">
                  Order ID: {order._id}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;