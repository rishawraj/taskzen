import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ListDetail from "./pages/ListDetail";
import TodayTask from "./pages/TodayTask";
import UpcomingTask from "./pages/UpcomingTask";
import SearchResult from "./pages/SearchResult";
import { PrivateRoute } from "./components/PrivateRoute";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Router basename="/taskzen/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* <Route path="/" element={<Home />} /> */}

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/list/:listName"
            element={
              <PrivateRoute>
                <ListDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/upcoming"
            element={
              <PrivateRoute>
                <UpcomingTask />
              </PrivateRoute>
            }
          />

          <Route
            path="/today"
            element={
              <PrivateRoute>
                <TodayTask />
              </PrivateRoute>
            }
          />

          <Route
            path="/search/:query"
            element={
              <PrivateRoute>
                <SearchResult />
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
