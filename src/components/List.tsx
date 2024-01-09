import { useEffect, useState } from "react";
import {
  setLocalStorageItem,
  getLocalStorageItem,
} from "../utils/localStorage";
import { NavLink } from "react-router-dom";
import {
  crossIcon,
  plusIcon,
  rightArrowIcon,
  solidSquare,
} from "../assets/icons";
import Modal from "./Modal";

function List() {
  const [list, setList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState("");
  const [isListMenu, setIsListMenu] = useState(false);

  const openListMenu = () => setIsListMenu(true);
  const closeListMenu = () => setIsListMenu(false);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // !
  useEffect(() => {
    if (isListMenu && !isSmallScreen) {
      closeListMenu();
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust the threshold if needed
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    const exists = list.find((l) => l === trimmedListName);

    if (exists !== undefined) {
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
      <h1 className="font-bold">List</h1>
      <div className="flex flex-col">
        {list.map((listItem, index) => (
          <NavLink
            className={({ isActive }) => (isActive ? "bg-green-300" : "")}
            key={index}
            to={`/${listItem}`}
          >
            <div className="flex gap-2">
              {solidSquare}

              {listItem}
            </div>
          </NavLink>
        ))}
      </div>

      <button onClick={openListMenu} className="flex gap-2 bg-red-30">
        {rightArrowIcon}More
      </button>

      <Modal
        isOpen={isListMenu}
        onClose={closeListMenu}
        fullScreen={isSmallScreen}
      >
        <div className="bg-accent w-full">
          <div className="flex justify-between">
            <h3 className="text-xl">Add List</h3>
            <button onClick={closeListMenu}>{crossIcon}</button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex border-2 border-red-400 rounded "
          >
            <button type="submit">{plusIcon}</button>
            <input
              onChange={(e) => setNewListItem(e.target.value)}
              value={newListItem}
              type="text"
              name="list-name"
              className="outline-none"
            />
          </form>

          <button onClick={handleClearAll} className="bg-red-100  p-2 mt-2">
            clear all lists
          </button>
        </div>
      </Modal>
    </>
  );
}

export default List;
