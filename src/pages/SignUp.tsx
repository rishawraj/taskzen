import { useState } from "react";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

  const handleSignup = async () => {
    try {
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

        setUser(data.user);
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <>
      <h2>Sign Up</h2>
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
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

      <button onClick={handleSignup}>Sign Up</button>

      {user && <p>{user}</p>}
    </>
  );
}

export default SignUp;
