import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";
import { useEffect, useState } from "react";
import { ListResponse } from "../types/types";
import { fetchWithAuth } from "../utils/fetchWithAuth";

function ListDetail() {
  const { listName } = useParams();
  const [currListItem, setCurrListItem] = useState<ListResponse>();

  useEffect(() => {
    const fetchList = async () => {
      const response = await fetchWithAuth<ListResponse[]>("/api/lists");
      const curr = response.find((list) => list.name === listName);
      setCurrListItem(curr);
    };
    fetchList();
  }, [listName]);

  return (
    <>
      <div className="flex flex-col md:flex-row bg-background justify-start h-full min-h-screen">
        <div className="md:w-1/3 md:max-w-sm">
          <NavBar />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <h1 className="text-4xl capitalize">{listName}</h1>
          <TaskLIstControl listName={currListItem} />
        </div>
      </div>
    </>
  );
}

export default ListDetail;
