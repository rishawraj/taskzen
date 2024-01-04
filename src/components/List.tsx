import { useEffect, useState } from "react";
import {
  setLocalStorageItem,
  getLocalStorageItem,
} from "../utils/localStorage";
import { NavLink } from "react-router-dom";

function List() {
  const [list, setList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState("");

  useEffect(() => {
    const localList = getLocalStorageItem<string[]>("list") || [];
    setList(localList);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedListName = newListItem.trim().toLowerCase();

    if (trimmedListName === "") {
      return;
    }

    if (list.some((l) => l === trimmedListName)) {
      return;
    }

    setList([...list, newListItem]);
    setLocalStorageItem("list", [...list, newListItem]);
    setNewListItem("");
  };

  const handleClearAll = () => {
    setList([]);
    setLocalStorageItem("list", []);
  };

  return (
    <>
      <h1 className="font-bold">List:</h1>
      <div className="flex flex-col">
        {list.map((listItem, index) => (
          <NavLink
            className={({ isActive }) => (isActive ? "bg-green-300" : "")}
            key={index}
            to={`/${listItem}`}
          >
            {listItem}
          </NavLink>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit">+</button>
        <input
          onChange={(e) => setNewListItem(e.target.value)}
          value={newListItem}
          type="text"
          name="list-name"
        />
      </form>

      <button onClick={handleClearAll} className="bg-red-100  p-2 mt-2">
        clear all lists
      </button>
    </>
  );
}

export default List;
