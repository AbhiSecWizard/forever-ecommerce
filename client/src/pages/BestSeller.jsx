// import React from 'react'

import { useContext, useEffect, useState } from "react"
import Title from "../components/Title"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "../components/ProductItem"

const BestSeller = () => {
    const {products} = useContext(ShopContext)
    const [bestSeller,setBestSeller] = useState([])
    console.log(bestSeller)
useEffect(()=>{
    const item = products.filter((item)=>item.bestseller == true)
    setBestSeller(item)
},[products])
  return (
    <div className="my-18">
    <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"}/>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel facilis consectetur dolorem dolore cumque est dolorum, non alias asperiores, nisi quam? Omnis dolor nesciunt possimus nostrum earum. Deserunt, veniam enim.
        </p>
    </div> 
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
       {
        bestSeller.map((item,index)=>{
            return <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
        })
       }
     </div>
    </div>
  )
}

export default BestSeller
