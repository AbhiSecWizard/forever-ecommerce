// import React from 'react'
import { useContext, useEffect, useState } from "react"
import Title from "../components/Title"
import {assets} from "../assets/frontend_assets/assets"
import { ShopContext } from "../context/ShopContext"
import ProductItem from "../components/ProductItem"
const Collection = () => {
  const {products,search,showSearch} = useContext(ShopContext)
  const [showFilter,setShowFilter] = useState(false)
  const [filterProducts,setFilterProducts] = useState([])
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortValue, setSortValue] = useState("relevant");
 
// toggle category means select or not of the checkbox 
  const toggleCategory = (e)=>{
   if(category.includes(e.target.value)){
    setCategory(prev => prev.filter(item => item !== e.target.value))
   }else{
    setCategory(prev => [...prev,e.target.value])
   }
  }
  const subToggleCategory = (e)=>{
    if(subCategory.includes(e.target.value)){
       setSubCategory(prev =>
       prev.filter(item => item !== e.target.value)
      )
    }
    else{
       setSubCategory(prev => [...prev,e.target.value])
    }
  }
  const applyFilter =()=>{
    let productCopy = products.slice();
    if (showSearch && search) {
    productCopy = productCopy.filter(
        item => item.name.toLowerCase().includes(search.toLowerCase())
    );
}    
   if (showSearch && search) {
    productCopy = productCopy.filter(
        item => item.name.toLowerCase().includes(search.toLowerCase())
    );
}    
    
    if(category.length > 0 ){
      productCopy = productCopy.filter(item => category.includes(item.category))
    } 
    if(subCategory.length > 0){
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory))
      console.log(productCopy,"hai to hai ")
    }
    setFilterProducts(productCopy)
  }
useEffect(()=>{
   applyFilter()
},[category,subCategory])

  useEffect(()=>{
  setFilterProducts(products)
  },[])
   
  useEffect(()=>{
    console.log(category)
  },[category])
  
   useEffect(()=>{
    console.log(subCategory)
  },[subCategory])
  
  useEffect(()=>{
    applyFilter()
  },[products, category, subCategory, showSearch, search])
  
 // filter according to price 
function handleChange(e) {
  const value = e.target.value;
  setSortValue(value);
  if (value === "low-high") {
    setFilterProducts(prev =>
      [...prev].sort((a, b) => a.price - b.price)
    );
  }
  if (value === "high-low") {
    setFilterProducts(prev =>
      [...prev].sort((a, b) => b.price - a.price)
    );
  }
  if (value === "relevant") {
    applyFilter();
  }
} 
  
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10; pt-10 border-t ">
    {/* Filter options  */}
     <div className="min-w-60">
     <p onClick={()=>setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
 <img className={`h-3  ${showFilter ? "rotate-90":""} `} src={assets.dropdown_icon} alt="" />
     {/* Cetegory */}
  
     </p>
     
    
      <div className={`${showFilter ? "hidden":"block"} border border-gray-300 pl-5 py-3 mt-6`}>
        <p className="mb-3 text-sm font-medium">CATEGORIES</p>
       <div className={`flex flex-col gap-2 text-sm font-light text-gray-700 `}>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Men"} onClick={toggleCategory}/> Men
          </p>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Women"} onClick={toggleCategory}/> Woman
          </p>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Kids"} onClick={toggleCategory}/> Kids
          </p>
        </div>
      </div>
      {/* SubCategory Filter */}
       <div className={`${showFilter ? "hidden":"block"} border border-gray-300 pl-5 py-3 mt-6`}>
        <p className="mb-3 text-sm font-medium">TYPE</p>
        <div className={`flex flex-col gap-2 text-sm font-light text-gray-700 `}>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Topwear"} onClick={subToggleCategory}/> Topwear
          </p>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Bottomwear"} onClick={subToggleCategory}/> Bottomwear
          </p>
          <p className="flex gap-2">
            <input className="w-3" type="checkbox" value={"Winterwear"} onClick={subToggleCategory}/> Winterwear
          </p>
        </div>
      </div>
      {/*  */}
     </div>
   {/* Right side  */}
   <div className="flex-1">
    <div className="flex justify-between text-base sm:text-2xl mb-4">
     <Title text1={"ALL"} text2={"COLLECTIONS"}/>
     {/* Product sort */}
     <select name="" id="" onChange={handleChange} className="border-2 border-gray-300 text-sm px-2">
      <option value="relavent">Sort by: Relavent</option>
      <option value="low-high">Sort by: Low to High</option>
      <option value="high-low">Sort by: High to Low</option>
     </select>
    </div>
    {/* Map Products */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
         {filterProducts.map((item,index)=>{
         return  <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price}/>         })}
    </div>
   </div>
    </div>
  )
} 
  
export default Collection
