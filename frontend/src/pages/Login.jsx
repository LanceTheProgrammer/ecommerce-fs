import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { setToken, navigate, backendUrl, setIsAuthenticated } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage on component mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      navigate('/'); // Redirect to home page if token exists
    }
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let response;
      if (currentState === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        console.log("Sign Up response:", response.data);
        toast.success("Account created successfully! Please log in.");
        setCurrentState("Login"); // Switch to login view after successful signup
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        console.log("Login response:", response.data);
        const { token } = response.data;
        localStorage.setItem('token', token); // Store token in localStorage
        setToken(token);
        setIsAuthenticated(true);
        toast.success("Logged in successfully!");
        navigate("/"); // Redirect to home page or dashboard
      }
      
      // Clear form fields after successful submission
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {currentState === "Sign Up" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
          <p
            onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
            className="cursor-pointer"
          >
            {currentState === "Login" ? "Create account" : "Login Here"}
          </p>
        </div>
        <button
          type="submit"
          className="bg-black text-white font-light px-8 py-2 mt-4 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : (currentState === "Login" ? "Sign In" : "Sign Up")}
        </button>
      </form>
    </>
  );
};

export default Login;