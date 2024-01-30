import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "./List";

import { useDarkMode } from "../Context/DarkModeContext";
import {
  burgerMenuIcon,
  crossIcon,
  doubleRightArrowIcon,
  homeIcon,
  listUlIcon,
  logOutIcon,
  loginIcon,
  solidSquare,
  trashIcon,
  userCircleIcon,
} from "../assets/icons";
import { useAuth } from "../Context/AuthContext";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { ListResponse, TaskDateCategory } from "../types/types";
import { toast } from "react-toastify";

export type NavBarProps = {
  handleTaskDate: (taskDateProp: TaskDateCategory) => void;
  handleSearchQuery: (searchQueryProp: string) => void;
  handleListItem: (listItemProp: ListResponse) => void;
  handleHome: () => void;
};

function NavBar({
  handleTaskDate,
  handleListItem,
  handleSearchQuery,
  handleHome,
}: NavBarProps) {
  const [isDrawer, setDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState<ListResponse[]>([]);

  const [triggerFetch, setTriggerFetch] = useState(false);

  const { isDarkMode, toggleTheme } = useDarkMode();
  const { user, logout } = useAuth();

  const triggerFetchList = () => setTriggerFetch(!triggerFetch);

  const themeIcon = isDarkMode ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-text"
    >
      <path d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="fill-text"
    >
      <path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"></path>
    </svg>
  );

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
  }, [triggerFetch]);

  const toggleDrawer = () => {
    setDrawer(!isDrawer);
    if (isDrawer) {
      document.body.classList.remove("overflow-hidden");
    } else {
      document.body.classList.add("overflow-hidden");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery === "") {
      toast.info("Search query cannot be empty");
      return;
    }
    handleSearchQuery(searchQuery);
    setSearchQuery("");
    setDrawer(!isDrawer);
  };

  const handleListDelete = async (ID: string) => {
    try {
      const backup = list;
      const updatedList = list.filter((list) => list._id !== ID);
      setList(updatedList);

      const response = await fetchWithAuth(`/api/lists/${ID}`, Methods.DELETE);

      if (response) {
        handleHome();
      } else {
        setList(backup);
      }
    } catch (error) {
      console.error("Error deleting list", error);
    }

    //
  };

  return (
    <>
      <nav className="flex flex-col p-3 sticky text-text h-full capitalize bg-background">
        <div className="flex md:flex-col md:justify-start justify-between items-start md:h-screen">
          <button
            className="font-bold text-2xl"
            onClick={() => {
              handleHome();
              setDrawer(false);
            }}
          >
            Taskzen
          </button>

          {/* mobile menu */}
          <div className="md:hidden">
            <button onClick={toggleDrawer}>
              {isDrawer ? crossIcon : burgerMenuIcon}
            </button>
          </div>

          {/* for full-size */}
          <div className="hidden bg-background text-text md:flex flex-col w-full justify-between h-full p-5">
            <div className="w-full flex flex-col gap-4">
              <form
                className="flex text-text border-2 rounded-2xl px-2 w-full"
                onSubmit={handleSubmit}
              >
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-text"
                  >
                    <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  </svg>
                </button>

                <input
                  className="bg-transparent outline-none px-2 py-1 placeholder:text-gray-400"
                  autoComplete="off"
                  id="quick-search"
                  placeholder="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <h2 className=" font-bold">tasks</h2>

              <div>
                <div className="flex flex-col">
                  <button
                    className="flex-1 hover:bg-accent rounded  p-2"
                    onClick={() => handleHome()}
                  >
                    <span className="flex gap-2">{homeIcon} Home</span>
                  </button>

                  <button
                    className="flex-1 hover:bg-accent rounded p-2"
                    onClick={() => handleTaskDate(TaskDateCategory.TODAY)}
                  >
                    <span className="flex gap-2">{listUlIcon} Today</span>
                  </button>

                  <button
                    onClick={() => handleTaskDate(TaskDateCategory.UPCOMING)}
                    className="flex-1 hover:bg-accent rounded p-2"
                  >
                    <span className="flex gap-2 ">
                      {doubleRightArrowIcon} Upcoming
                    </span>
                  </button>
                </div>
              </div>

              <h2 className="font-bold">List</h2>

              <div className="flex flex-col">
                {list.map &&
                  list.map((listItem, index) => (
                    <div
                      key={listItem._id}
                      className="flex justify-between p-2 w-full hover:bg-accent rounded"
                    >
                      <button
                        className="flex-1"
                        key={index}
                        onClick={() => handleListItem(listItem)}
                      >
                        <div className="flex gap-2">
                          {solidSquare}
                          {listItem.name}
                        </div>
                      </button>
                      <button
                        onClick={() => handleListDelete(listItem._id || "")}
                      >
                        {trashIcon}
                      </button>
                    </div>
                  ))}
              </div>
              <List triggerFetch={triggerFetchList} />
            </div>

            <div className="flex justify-between w-full items-end">
              <div>
                {user == null ? (
                  <Link className="font-bold flex gap-2" to="/login">
                    {loginIcon}Login
                  </Link>
                ) : (
                  <div className="flex flex-col capitalize justify-start gap-2">
                    <p className=" flex gap-2 font-bold">
                      {userCircleIcon} {user.username}
                    </p>
                    <button className="flex gap-2 " onClick={logout}>
                      {logOutIcon} Sign out
                    </button>
                  </div>
                )}
              </div>

              <button onClick={toggleTheme}>{themeIcon}</button>
            </div>
          </div>
        </div>

        {/* Mobile  */}
        {isDrawer && (
          <div className="md:hidden bg-background text-text flex flex-col items-center h-screen pt-4">
            <form
              className="flex text-text border-2 rounded-2xl px-2 mt-2"
              onSubmit={handleSubmit}
            >
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-text"
                >
                  <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                </svg>
              </button>

              <input
                className="bg-transparent outline-none px-2 py-1 placeholder:text-text"
                autoComplete="off"
                id="quick-search"
                type="text"
                value={searchQuery}
                placeholder="search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="w-full p-2 mt-3 h-full flex flex-col justify-start">
              <div className="flex flex-col gap-2">
                <h2 className=" font-bold mb-2 text-xl text-dark">Tasks</h2>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleHome();
                      setDrawer(false);
                    }}
                  >
                    <span className="flex gap-2">{homeIcon} Home</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTaskDate(TaskDateCategory.TODAY);
                      setDrawer(false);
                    }}
                  >
                    <span className="flex gap-2">{listUlIcon} Today</span>
                  </button>

                  <button
                    onClick={() => {
                      handleTaskDate(TaskDateCategory.UPCOMING);
                      setDrawer(false);
                    }}
                  >
                    <span className="flex gap-2">
                      {doubleRightArrowIcon} Upcoming
                    </span>
                  </button>
                </div>

                <h2 className="font-bold text-xl text-dark">List</h2>

                {list.map &&
                  list.map((listItem, index) => (
                    <div key={listItem._id} className="flex justify-between">
                      <button
                        key={index}
                        onClick={() => {
                          handleListItem(listItem);
                          setDrawer(false);
                        }}
                      >
                        <div className="flex gap-2">
                          {solidSquare}
                          {listItem.name}
                        </div>
                      </button>
                      <button
                        onClick={() => handleListDelete(listItem._id || "")}
                      >
                        {trashIcon}
                      </button>
                    </div>
                  ))}

                <List triggerFetch={triggerFetchList} />
              </div>

              <div className="flex justify-between w-full items-end my-5">
                <div>
                  {user == null ? (
                    <Link className="font-bold flex gap-2" to="/login">
                      {loginIcon} Login
                    </Link>
                  ) : (
                    <div className="flex flex-col justify-start gap-2">
                      <button className="flex gap-2 capitalize font-semibold">
                        {userCircleIcon} {user.username}
                      </button>
                      <button className="flex gap-2" onClick={logout}>
                        {logOutIcon} Sign out
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={toggleTheme}>{themeIcon}</button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default NavBar;
