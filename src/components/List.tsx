import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  crossIcon,
  plusIcon,
  rightArrowIcon,
  solidSquare,
} from "../assets/icons";
import Modal from "./Modal";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { toast } from "react-toastify";
import { ListResponse } from "../types/types";

function List() {
  const [list, setList] = useState<ListResponse[]>([]);
  const [newListItem, setNewListItem] = useState("");
  const [isListMenu, setIsListMenu] = useState(false);

  const openListMenu = () => setIsListMenu(true);
  const closeListMenu = () => setIsListMenu(false);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  //  close listmenu on resize
  useEffect(() => {
    if (isListMenu && !isSmallScreen) {
      closeListMenu();
    }
  }, [isSmallScreen]);

  // handle resize
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
    const fetchData = async () => {
      try {
        const data = await fetchWithAuth<ListResponse[]>(
          "/api/lists",
          Methods.GET
        );
        setList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const trimmedListName = newListItem.trim().toLowerCase();

      if (trimmedListName === "") {
        return;
      }

      const exists = list.find((l) => l.name === trimmedListName);

      if (exists !== undefined) {
        toast.info("list name already exits");
        return;
      }

      const reqBody: ListResponse = {
        name: newListItem,
      };

      setList([...list, reqBody]);
      setNewListItem("");

      const response = await fetchWithAuth<ListResponse>(
        "/api/lists",
        Methods.POST,
        reqBody
      );

      if (!response) {
        console.error(response);

        setList((prevList) => {
          const newList = [...prevList];
          newList.pop();
          return newList;
        });
      }
    } catch (error) {}
  };

  const handleClearAll = async () => {
    try {
      const backupList = [...list];
      setList([]);

      const response = await fetchWithAuth("/api/lists", Methods.DELETE);

      if (!response) {
        setList((prevList) => [...prevList, ...backupList]);
      }
    } catch (error) {
      console.error("Error clearing list:", error);
    }
  };

  return (
    <>
      <h1 className="font-bold">List</h1>
      <div className="flex flex-col">
        {list.map &&
          list.map((listItem, index) => (
            <NavLink
              className={({ isActive }) => (isActive ? "bg-green-300" : "")}
              key={index}
              to={`/${listItem.name}`}
            >
              <div className="flex gap-2">
                {solidSquare}

                {listItem.name}
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
