import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import ListDetail from "./pages/ListDetail";
import TodayTask from "./pages/TodayTask";
import UpcomingTask from "./pages/UpcomingTask";
import SearchResult from "./pages/SearchResult";

export default function App() {
  return (
    <>
      <Router basename="/taskzen/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/:listName" element={<ListDetail />} />
          <Route path="/upcoming" element={<UpcomingTask />} />
          <Route path="/today" element={<TodayTask />} />
          <Route path="/search/:query" element={<SearchResult />} />
        </Routes>
      </Router>
    </>
  );
}
