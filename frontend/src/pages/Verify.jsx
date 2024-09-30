import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems({});
        toast.success("Payment verified successfully!");
        navigate("/orders");
      } else {
        toast.error("Payment verification failed.");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(error.response?.data?.message || "An error occurred during payment verification");
      navigate("/cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  if (isLoading) {
    return <div>Verifying payment...</div>;
  }

  return null;
};

export default Verify;
