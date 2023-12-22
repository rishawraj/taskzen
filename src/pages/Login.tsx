import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function Login() {
  return (
    <>
      <div className="bg-blue-300 h-full min-h-screen w-screen flex justify-center">
        <div className="w-full max-w-4xl ">
          <NavBar />
          <h1>Login</h1>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
}

export default Login;
