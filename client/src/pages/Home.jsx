// import React from 'react'

import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection"
import NewaLetterBox from "../components/NewaLetterBox"
import OurPolicy from "../components/OurPolicy"
import BestSeller from "./BestSeller"

const Home = () => {
  return (
   <div>
    <Hero/>
    <LatestCollection/>
    <BestSeller/>
    <OurPolicy/>
    <NewaLetterBox/>
   </div>
  )
}

export default Home
