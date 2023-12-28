import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function Login() {
  return (
    <>
      <NavBar />
      <h1>Login</h1>
      <Link to="/signup">Sign Up</Link>
    </>
  );
}

export default Login;
