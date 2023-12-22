import { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <nav className=" flex justify-between p-2 pt-4  sticky ">
      <Link to="/">
        <h1 className="font-bold">Taskzen</h1>
      </Link>
      <Link className="font-bold" to="/login">
        Login
      </Link>
      <button onClick={toggleTheme}>{":)"}</button>
    </nav>
  );
}

export default NavBar;
