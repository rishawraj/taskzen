import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import TaskLIstControl from "../components/TaskLIstControl";
import { useState } from "react";
import { ListResponse, TaskDateCategory } from "../types/types";

export default function Home() {
  const [count, setCount] = useState(0);
  const [taskDate, setTaskDate] = useState<TaskDateCategory>();
  const [searchQuery, setSearchQuery] = useState("");
  const [listItem, setListItem] = useState<ListResponse>();

  const handleTaskDate = (taskDateProp: TaskDateCategory) => {
    setTaskDate(taskDateProp);
    setListItem(undefined);
    setSearchQuery("");
    setCount(count + 1);
  };

  const handleSearchQuery = (searchQueryProp: string) => {
    setSearchQuery(searchQueryProp);
    setTaskDate(undefined);
    setListItem(undefined);
    setCount(count + 1);
  };

  const handleListItem = (listItemProp: ListResponse) => {
    setListItem(listItemProp);
    setSearchQuery("");
    setTaskDate(undefined);
    setCount(count + 1);
  };

  const handleHome = () => {
    setTaskDate(undefined);
    setSearchQuery("");
    setListItem(undefined);
    setCount(count + 1);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row bg-background justify-start h-full min-h-screen">
        <div className="md:w-1/3 md:max-w-sm sticky top-0 h-full">
          <NavBar
            handleListItem={handleListItem}
            handleSearchQuery={handleSearchQuery}
            handleTaskDate={handleTaskDate}
            handleHome={handleHome}
          />
        </div>

        <div className="md:w-2/3 bg-pink-300 flex-grow">
          <TaskLIstControl
            key={count}
            listName={listItem}
            taskDate={taskDate}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </>
  );
}
