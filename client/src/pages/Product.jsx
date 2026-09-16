
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products,currency,cartItems,addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [size ,setSize] = useState('')
  useEffect(() => {
    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setSelectedImage(product.image[0]);
    }
  }, [products, productId]);

  if (!productData) {
    return null;
  }
  // console.log(productData)
  console.log(productData?.sizes)
  return (
    <div className="border-t-2 pt-10">

      <div className="flex flex-col gap-12 sm:flex-row">

        {/* Product Images */}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">

          {/* Thumbnail Images */}
          <div className="flex w-full gap-3 overflow-x-auto sm:w-[18.7%] sm:flex-col sm:overflow-y-auto">

            {productData.image.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${productData.name} ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className="w-[24%] flex-shrink-0 cursor-pointer object-cover sm:mb-3 sm:w-full"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={selectedImage}
              alt={productData.name}
              className="w-full object-cover"
            />
          </div>

        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">
            {productData.name}
          </h1>
          <div className="flex items-center mt-2 gap-1">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5 ">{productData.description}</p>
         <div className="flex flex-col gap-4 my-8 ">
          <p>
            Select Size
          </p>
          <div className="flex gap-2">
            {productData?.sizes.map((item,index)=>{
              return (
                <button onClick={()=>setSize(item)} key={index} className={`cursor-pointer outline-none py-2 px-4 bg-gray-400 ${item === size ?"border border-orange-500":""}`}>
                  {item}
                  </button>
              )
            })}
          </div>

         </div>
         <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 " onClick={()=>addToCart(productData._id,size )}>ADD TO CART</button>
       <hr className="mt-8 sm:3/4" />
         <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
             <p>100% Orginal Product.</p>
             <p>Cash on delivery is Available on this product.</p>
             <p>Easy return and exchange policy within 7 days.</p>
         </div>
        </div>
      </div>
      {/* Description and review  */}
      <div className="mt-20 ">
        <div className="flex">
          <b className="border px-5 py-3 text-sm ">Description</b>
          <p className="border px-5 py-3 text-sm ">Reviews(122)</p>
        </div>
          <div className="flex flex-col gap-4 border px-6 py-6  text-sm text-gray-500 ">
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia repellat omnis earum qui .
                    
                  </p>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor quos fugit nulla, nemo, pariatur qui laudantium veniam, minus numquam dolores vero perferendis hic accusantium. Id fuga enim laudantium corrupti ea.
                  </p>

          </div>
      </div>
      {/* display related products  */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
      
    </div>
  );
};

export default Product;