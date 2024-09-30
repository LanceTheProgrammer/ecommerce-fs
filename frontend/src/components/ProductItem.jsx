import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ProductItem = ({ id, images = [], name, price }) => {
  const { currency, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Safely access the image URL, use placeholder if no images are available
  const imageUrl =
    images.length > 0 ? images[0] : "/path/to/placeholder-image.jpg"; // Use the first image directly

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      className="text-gray-700 cursor-pointer"
      onClick={handleClick}
      href={`/product/${id}`}
    >
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={imageUrl}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </a>
  );
};

export default ProductItem;
