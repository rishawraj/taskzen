import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useDarkMode } from "../Context/DarkModeContext";
import logoWhite from "../assets/logo-white.png";
import logoBlack from "../assets/logo-black.png";
import "../styles/Loading.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login, isLoading } = useAuth();
  const { isDarkMode } = useDarkMode();

  const logoPath = isDarkMode ? logoWhite : logoBlack;

  const handleLogin = async () => {
    try {
      await login(email, password);

      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-5 items-center justify-center min-h-screen bg-background">
      <div className="flex justify-center items-center ">
        <img src={logoPath} alt="logo" />
      </div>
      <div className="bg-primary p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-semibold mb-6">Login</h2>
        <div className="mb-4">
          <label
            className="block text-lightText text-sm font-bold mb-2 text-l"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2 text-lightText"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <button
            className="bg-dark text-white py-2 px-4 rounded hover:opacity-80  focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
        <p className="mt-4 text-sm text-light">
          Don't have an account?{" "}
          <Link to="/signup" className="text-linkColor hover:underline">
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
