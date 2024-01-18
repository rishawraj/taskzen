import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";
import { useEffect, useState } from "react";

function SearchResult() {
  const { query } = useParams() || "";
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [query]);

  return (
    <>
      <div className="flex flex-col md:flex-row bg-background justify-start h-full min-h-screen">
        <div className="md:w-1/3 md:max-w-sm">
          <NavBar />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <button onClick={() => navigate(-1)}>go back</button>

          <h1 className="text-4xl capitalize">Search Results for "{query}":</h1>
          {query && <TaskLIstControl key={count} searchQuery={query} />}
        </div>
      </div>
    </>
  );
}

export default SearchResult;
