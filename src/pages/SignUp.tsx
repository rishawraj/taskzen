import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../Context/DarkModeContext";
import logoWhite from "../assets/logo-white.png";
import logoBlack from "../assets/logo-black.png";
import "../styles/Loading.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { isDarkMode } = useDarkMode();

  const logoPath = isDarkMode ? logoWhite : logoBlack;

  const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(VITE_BASE_BACKEND_URL + "/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        console.log(data);

        navigate("/login");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-5 items-center justify-center min-h-screen bg-background">
      <div className="bg-red-3000 flex justify-center items-center ">
        <img src={logoPath} alt="logo" />
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-semibold mb-6">Sign Up</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        )}

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in here.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
