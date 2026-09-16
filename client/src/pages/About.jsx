// import React from 'react'
import { assets } from "../assets/frontend_assets/assets"
import Title from "../components/Title"
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
            
            <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className={`my-10 flex flex-col md:flex-row gap-16`}>
        <img src={assets.about_img} className="w-full md:max-w-[450px]" alt="" />
                  <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                   <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur a voluptatum nesciunt soluta dignissimos quod, praesentium sapiente ex suscipit officia cumque, fugit laboriosam ipsa libero laudantium odio excepturi quos magnam!</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, cupiditate qui dolorem cumque explicabo nisi esse blanditiis reprehenderit vero. Impedit, nulla quidem repellat eos eveniet dolores cupiditate iusto? Animi error deserunt quod architecto cumque minima quas illo assumenda voluptatibus nemo fugit totam voluptate, fugiat at dolore ipsam, ipsa, accusantium quis.</p>
                     <b className="text-gray-800">Our Mission</b>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis dolorum fuga assumenda saepe voluptate expedita, consectetur iure dolore adipisci. Odit iure pariatur temporibus aliquid sapiente nam sequi, est dolorem similique, ratione illum architecto fugit necessitatibus. Commodi voluptates similique animi reprehenderit vitae exercitationem. Ex illum repellat laudantium vel vero tenetur maxime consequuntur esse omnis. Omnis vero aliquam dolorum necessitatibus perspiciatis optio.</p>
                      
                  </div>
      </div>
      <div className="text-xl py-4">
      <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        
      <div className="border-[0.3px] border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Quality Assurance </b>
                <p className="text-gray-600 ">We meticulouly select and vet each product to ensure it meets our strigment </p>
      </div>
        <div className="border-[0.3px] border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Convenience:</b>
                <p className="text-gray-600 ">With our user-friendly interface and hassle-free ordering process , shopping has never been easier</p>
      </div>
      <div className="border-[0.3px] border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                <b>Exceptional Customer Service</b>
                <p className="text-gray-600 ">Our team of dedicated professionals is here to assist you the way ,ensuring your </p>
      </div>
      </div>

      
    </div>
  )
}

export default About
