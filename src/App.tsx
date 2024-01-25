import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { PrivateRoute } from "./components/PrivateRoute";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Router basename="/taskzen/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          {/* wildcard routes */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
