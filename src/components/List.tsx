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

    setList([...list, newListItem]);
    setLocalStorageItem("list", [...list, newListItem]);
    setNewListItem("");
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
    </>
  );
}

export default List;
