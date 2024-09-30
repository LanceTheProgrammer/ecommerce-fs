import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      getUserCart(token);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setCartItems({});
    }
  }, [token]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await getProductsData();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await getUserCart(storedToken);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    return () => {
      // Dismiss all active toasts on unmount
      toast.dismiss();
    };
  }, []);

  const logout = () => {
    navigate("/login");
    toast.success("Logged out successfully");
    setToken("");
    setCartItems({});
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      console.log("Size not selected, showing error");

      // Wrap toast in try/catch to handle any issues
      try {
        toast.error("Select Product Size");
      } catch (error) {
        console.error("Error triggering toast:", error);
      }

      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Dynamically update the cart total count when adding or removing products
  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      // Iterate through cart items

      for (const item in cartItems[items]) {
        // iterate through cart items with size
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            totalAmount += itemInfo.price * cartItems[itemId][size];
          }
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    const apiUrl = `${backendUrl}/api/product/list`;

    try {
      const response = await axios.get(apiUrl);

      if (
        Array.isArray(response.data) ||
        (typeof response.data === "object" && response.data.products)
      ) {
        setProducts(
          Array.isArray(response.data) ? response.data : response.data.products
        );
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Error fetching products:", error.response || error);
      toast.error(`Failed to fetch products: ${error.message}`);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    logout,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    getUserCart,
    setCartItems,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
