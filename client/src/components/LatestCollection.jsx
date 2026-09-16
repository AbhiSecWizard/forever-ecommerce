// import React from 'react'

import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "./Title"
import ProductItem from "./ProductItem"

const LatestCollection = () => {
const {products} = useContext(ShopContext)
const [latestProducts,setLatestProducts]= useState([])
console.log(latestProducts)
useEffect(()=>{
setLatestProducts(products.slice(0,10))
},[products])
    return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
      <Title text1="LATEST" text2={"COLLECTIONS"}/>
      <p className="text-gray-700 text-xs sm:text-sm md:text-base">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta quis vel enim amet quisquam! Repellendus, molestias inventore. Molestiae reiciendis pariatur itaque nemo? Doloremque nesciunt, nulla consectetur quod sint architecto aliquid!
      </p>
      </div>
      {/* rendering productions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 "> 
              {
            latestProducts.map((item,index)=>{
                return <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price}/>
            })
        }
      </div>
    </div>
  )
}

export default LatestCollection
