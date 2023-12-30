import { useEffect, useState } from "react";
import {
  setLocalStorageItem,
  getLocalStorageItem,
} from "../utils/localStorage";

function List() {
  const [list, setList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState("");

  useEffect(() => {
    const locallList = getLocalStorageItem<string[]>("list") || [];
    setList(locallList);
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
      {list.map((listItem, index) => (
        <p key={index}>{listItem}</p>
      ))}

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
