import { createContext, useEffect, useState } from "react";
// import {products} from "../assets/frontend_assets/assets"
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import axios from "axios"
export const ShopContext = createContext()


const ShopContextProvider = (props)=>{
const backendUrl = import.meta.env.VITE_BACKEND_URL
const currency = '$';
const navigate = useNavigate()
const delivery_fee = 10;
const [search,setSearch] = useState("")
const [showSearch,setShowSearch] = useState(false)
const [cartItems,setCartItems] = useState({})
const [products,setProducts] = useState([])
const [token,setToken]= useState('')
const addToCart = async  (itemId,size)=>{
    if(size==""){
      toast.error("Please Select Product  Size!")
      return;
    }
    let cartData = structuredClone(cartItems)
    if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] +=1
                toast.success("Your Product added into cart")
            }
            else{
                cartData[itemId][size] =1
            }
    }else {
        cartData[itemId] ={}
        cartData[itemId][size] = 1;

    }
    setCartItems(cartData)
  if (token) {
    try {
        const response = await axios.post(
            backendUrl + '/api/cart/add',
            {
                itemId,
                size
            },
            {
                headers: {
                    token: token
                }
            }
        );

        if (response.data.success) {
            toast.success(response.data.message);
        }

    } catch (error) {
        console.log(error.response?.data || error.message);
    }
}
}

useEffect(()=>{
console.log(cartItems)
},[cartItems])


const getCartCount = ()=>{
    let totalCount = 0; 
    for(const items in cartItems){
        for(const item in cartItems[items]){
            try {
                if(cartItems[items][item] > 0){
                    totalCount += cartItems[items][item];
                }
            } catch (error) {
                
            }
        }
    }
    return totalCount;
}

const getCartAmount = ()=>{
let totalAmount = 0;
for (const items in cartItems){
    let itemInfo = products.find((product)=> product._id ===items);
    for(const item in cartItems[items]){
     try {
        if(cartItems[items][item] > 0){
            totalAmount += itemInfo.price * cartItems[items][item];
        }
     } catch (error) {
        console.log(error)
     }
    }
}
return totalAmount;
}

const getProductsData = async ()=>{
try {
    const response = await axios.get(`${backendUrl}/api/product/list`)
    if(response.data.success){
        setProducts(response.data.products)
    }else{
        toast.error(response.data.message)
    }
} catch (error) {
    console.log(error)
    toast.error(error.message)
}
}

useEffect(()=>{
getProductsData()
},[])

// const updateQuantity =async  (itemId,size,quantity)=>{
//     let cartData = structuredClone(cartItems);
//     cartData[itemId][size] = quantity;
//     setCartItems(cartData)
//    if(token){
//     try {
//         await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity},{headers:{token}})
//     } catch (error) {
//        console.log(error)
//        toast.error(error.message) 
//     }
//    }
// }


const updateQuantity = async (itemId, size, quantity) => {
  let cartData = structuredClone(cartItems);

  cartData[itemId][size] = quantity;

  setCartItems(cartData);

  if (token) {
    try {
      await axios.put(
        backendUrl + "/api/cart/update",
        {
          itemId,
          size,
          quantity
        },
        {
          headers: {
            token: token
          }
        }
      );
    } catch (error) {
      console.log(
        "UPDATE CART ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  }
};

const getUserCart = async (token) => {
  try {
    const response = await axios.get(
      backendUrl + "/api/cart/get",
      {
        headers: {
          token: token
        }
      }
    );

    console.log("CART RESPONSE:", response.data);

    if (response.data.success) {
      setCartItems(response.data.cartData);
    }

  } catch (error) {
    console.log(
      "CART ERROR:",
      error.response?.data || error.message
    );
  }
};
useEffect(() => {

    if (token) {
        getUserCart(token);
    }

}, [token]);



useEffect(()=>{
if(!token && localStorage.getItem('token')){
    setToken(localStorage.getItem('token'))
}
},[])





const value = {
   getCartAmount,setCartItems,navigate,token ,setToken, backendUrl, updateQuantity, getCartCount , products, currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,addToCart
    }
return (
    <ShopContext.Provider value={value}>
    {props.children}
    </ShopContext.Provider>
)


}
export default ShopContextProvider