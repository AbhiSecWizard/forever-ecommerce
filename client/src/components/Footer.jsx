import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

      {/* LEFT SECTION */}
      <div>
        <img src={assets.logo} alt="Logo" className="mb-5 w-32" />

        <p className="w-full md:w-2/3 text-gray-600 leading-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          nesciunt, sint quia tempore exercitationem sequi. Hic nisi alias
          vero harum velit nesciunt eum saepe, officiis in vel ducimus
          numquam quibusdam?
        </p>
      </div>

      {/* COMPANY SECTION */}
      <div>
        <p className="text-xl font-medium mb-5">COMPANY</p>

        <ul className="flex flex-col gap-2 text-gray-600">
          <li>Home</li>
          <li>About us</li>
          <li>Delivery</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      {/* CONTACT SECTION */}
      <div>
        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

        <ul className="flex flex-col gap-2 text-gray-600">
          <li>+1-211-456-7789</li>
          <li>contact@gmail.com</li>
        </ul>
      </div>

    </div>
  );
};

export default Footer;