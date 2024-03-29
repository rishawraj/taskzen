import { useEffect, useState } from "react";
import { crossIcon, plusIcon, rightArrowIcon } from "../assets/icons";
import Modal from "./Modal";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { toast } from "react-toastify";
import { ListResponse } from "../types/types";

interface ListProps {
  triggerFetch: () => void;
}

function List({ triggerFetch }: ListProps) {
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
    } catch (error) {
      console.error("Error Add List:", error);
    }
    triggerFetch();
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
    triggerFetch();
  };

  return (
    <>
      <button onClick={openListMenu} className="flex gap-2 bg-red-30">
        {rightArrowIcon}More
      </button>

      <Modal
        isOpen={isListMenu}
        onClose={closeListMenu}
        fullScreen={isSmallScreen}
        closeOnOutsideClick={isSmallScreen}
      >
        <div className="bg-accent w-full p-3 text-text rounded">
          <div className="flex justify-between mb-5">
            <h3 className="text-xl">Add List</h3>
            <button onClick={closeListMenu}>{crossIcon}</button>
          </div>
          <form onSubmit={handleSubmit} className="flex border-2 rounded ">
            <button type="submit">{plusIcon}</button>
            <input
              onChange={(e) => setNewListItem(e.target.value)}
              value={newListItem}
              type="text"
              name="list-name"
              placeholder="add list"
              className="outline-none placeholder:text-text bg-transparent px-3 py-1"
            />
          </form>

          <button
            onClick={handleClearAll}
            className="p-2 mt-5 bg-dark text-text"
          >
            clear all lists
          </button>
        </div>
      </Modal>
    </>
  );
}

export default List;
