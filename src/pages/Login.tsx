import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const response = await fetch(VITE_BASE_BACKEND_URL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // ! any
        const data = (await response.json()) as any;
        console.log(data);
        const jwtToken = data.token;
        const userId = data.userId;
        const username = data.username;

        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);

        setToken(jwtToken);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>
          email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>

      {token && (
        <div>
          <h3>JWT Token</h3>
          <p>{token}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
