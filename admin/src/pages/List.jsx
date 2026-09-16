import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
    const [productList, setProductList] = useState([]);

    const currency = "$";

    // Get all products
    const showList = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/product/list`
            );

            if (response.data.success) {
                setProductList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    // Remove product
    const removeProduct = async (id) => {
        try {
            const response = await axios.delete(
                `${backendUrl}/api/product/remove`,
                {
                    data: {
                        id: id,
                    },
                    headers: {
                        token: token,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);

                // Remove product from UI
                setProductList((prev) =>
                    prev.filter((item) => item._id !== id)
                );
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    useEffect(() => {
        showList();
    }, []);

    return (
        <div>
            <p className="mb-2">All Products List</p>

            <div className="flex flex-col gap-2">

                {/* Header */}
                <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className="text-center">Actions</b>
                </div>

                {/* Products */}
                {productList.map((item) => (
                    <div
                        key={item._id}
                        className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
                    >
                        {/* Image */}
                        <img
                            src={item.image?.[0]}
                            alt={item.name}
                            className="w-12 h-12 object-cover"
                        />

                        {/* Name */}
                        <p>{item.name}</p>

                        {/* Category */}
                        <p>{item.category}</p>

                        {/* Price */}
                        <p>
                            {currency}
                            {item.price}
                        </p>

                        {/* Delete */}
                        <p
                            onClick={() => removeProduct(item._id)}
                            className="text-right md:text-center cursor-pointer text-red-500 font-bold"
                        >
                            X
                        </p>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default List;