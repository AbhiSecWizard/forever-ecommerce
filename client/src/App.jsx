// import React from 'react'

import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from "./pages/About"
import Cart from "./pages/Cart"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Orders from "./pages/Orders"
import PlaceOrder from "./pages/PlaceOrder"
import Product from "./pages/Product"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SearchBar from "./components/SearchBar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from "./pages/Verify"
const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar/>
      <ToastContainer/>
      <SearchBar/>
       <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<Collection/>} path="/collection"/>
        <Route element={<About/>} path="/about"/>
        <Route element={<Cart/>} path="/cart"/>
        <Route element={<Contact/>} path="/contact"/>
         <Route element={<Login/>} path="/login"/>
         <Route element={<Orders/>} path="/orders"/>
         <Route element={<PlaceOrder/>} path="/place-order"/>
         <Route element={<Product/>} path="/product/:productId"/>
         <Route path="/verify" element={<Verify />} />
       
       </Routes>
       <Footer/>
    </div>
  )
}

export default App
