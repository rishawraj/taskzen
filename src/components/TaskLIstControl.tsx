import { useState, useEffect } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";
import Task from "./Task";
import { ToastContainer, toast } from "react-toastify";
import { crossIcon, dotsVerticalIcon, filterIcon } from "../assets/icons";

import { useDarkMode } from "../Context/DarkModeContext";
import Modal from "./Modal";

import TaskDetailsForm from "./TaskDetailsForm";
import Tags from "./Tags";
import {
  DeleteResponse,
  ListResponse,
  TagType,
  TaskTypeResponse,
} from "../types/types";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../Context/AuthContext";
import "../styles/Spinner-dotted.css";

enum TaskDateCategory {
  UPCOMING = "UPCOMING",
  TODAY = "TODAY",
}

export interface TaskLIstControlProps {
  listName?: ListResponse;
  taskDate?: TaskDateCategory;
  searchQuery?: string;
}

function TaskLIstControl({
  listName,
  taskDate,
  searchQuery,
}: TaskLIstControlProps) {
  const [originalTaskList, setOrginalTaskList] = useState<TaskTypeResponse[]>(
    []
  );
  const [taskList, setTaskList] = useState<TaskTypeResponse[]>([]);
  const [newTask, setNewTask] = useState("");

  const [isDotMenu, setIsDotMenu] = useState(false);
  const [isSideModal, setIsSideModal] = useState(false);
  const [isEditTagMenu, setIsEditTagMenu] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [count, setCount] = useState(0);

  const [currTask, setCurrTask] = useState<TaskTypeResponse>();
  const [isFilterTag, setIsFilterTag] = useState(false);
  const [isScreenBelowXL, setIsScreenBelowXL] = useState(
    window.innerWidth < 1280
  );
  const [appliedTags, setAppliedTags] = useState<TagType[]>(
    getLocalStorageItem<TagType[]>("appliedTags") || []
  );

  const [availableTags, setAvailableTags] = useState(
    getLocalStorageItem<TagType[]>("tags") || []
  );

  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  //fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const result = await fetchWithAuth<TaskTypeResponse[]>("/api/tasks");
        setOrginalTaskList(result);

        const sorted = sortTasksByCompleted(result);
        const filtered = filteredTasks(sorted);
        setTaskList(filtered);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // todo Tags
  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetchWithAuth<TagType[]>("/api/tags");
      console.log(response);

      setAvailableTags(response);
    };

    fetchTags();

    setAppliedTags(getLocalStorageItem<TagType[]>("appliedTags"));
  }, [isEditTagMenu]);

  // Resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setIsScreenBelowXL(newWidth < 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //! filter tasks
  useEffect(() => {
    // console.log(taskDate);
    // console.log(listName);

    fetchWithAuth<TaskTypeResponse[]>("/api/tasks")
      .then((data) => {
        setOrginalTaskList(data);
        const sorted = sortTasksByCompleted(data);
        // console.log(sorted);

        const filtered = filteredTasks(sorted);
        // console.log(filtered);

        setTaskList(filtered);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [listName, taskDate, trigger, appliedTags, searchQuery]);
  // !

  const closeEditMenu = () => setIsEditTagMenu(false);
  const openEditMenu = () => setIsEditTagMenu(true);
  const closeFilterTag = () => setIsFilterTag(false);
  const toggleFilterTag = () => setIsFilterTag((prev) => !prev);
  const closeSideModal = () => setIsSideModal(false);
  const openSideModal = () => setIsSideModal(true);
  const closeDotMenu = () => setIsDotMenu(false);
  const toggleDotMenu = () => setIsDotMenu((prev) => !prev);

  const updateCurrTask = (ID: string) => {
    const tasks = originalTaskList;
    const task = tasks.find((t) => t._id === ID);
    setCurrTask(task);
    setCount((prevCount) => prevCount + 1);
  };

  const sortTasksByCompleted = (
    tasks: TaskTypeResponse[]
  ): TaskTypeResponse[] => {
    // Sorting tasks in ascending order based on the 'completed' property
    return tasks.sort((taskA, taskB) => {
      if (taskA.completed && !taskB.completed) {
        return 1;
      } else if (!taskA.completed && taskB.completed) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  const filterTaskListByAppliedTags = (
    taskList: TaskTypeResponse[],
    tagList: TagType[]
  ): TaskTypeResponse[] => {
    if (!tagList || !tagList.length) {
      return taskList;
    }

    const filteredTaskList: TaskTypeResponse[] = [];

    for (const task of taskList) {
      if (task.tags) {
        let hasAllTags = true;

        for (const tag of tagList) {
          const tagPresent = task.tags.some((taskTag) => taskTag === tag._id);

          if (!tagPresent) {
            hasAllTags = false;
            break;
          }
        }
        if (hasAllTags) {
          filteredTaskList.push(task);
        }
      }
    }
    return filteredTaskList;
  };

  const filteredTasks = (
    inputTaskList: TaskTypeResponse[]
  ): TaskTypeResponse[] => {
    let taskList = inputTaskList;

    if (searchQuery !== undefined && searchQuery !== "") {
      taskList = inputTaskList.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (listName) {
      taskList = inputTaskList.filter(
        (task) => task.selectedListItem?.name === listName.name
      );
    } else if (taskDate === TaskDateCategory.UPCOMING) {
      taskList = inputTaskList.filter((task) => task.dueDate);
    } else if (taskDate === TaskDateCategory.TODAY) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      taskList = inputTaskList.filter((task) => {
        if (task.dueDate) {
          console.log(task.title);

          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          return dueDate.getTime() === today.getTime();
        } else {
          return false;
        }
      });
    }

    const filteredTasks = filterTaskListByAppliedTags(taskList, appliedTags);

    return filteredTasks;
  };

  const handleDelete = async (ID: string) => {
    const message = await fetchWithAuth(`/api/tasks/${ID}`, Methods.DELETE);
    if (!message) {
      toast.error("Task not deleted, Try again!");
    }
    setTrigger(!trigger);
    return;
  };

  const handleToggle = async (ID: string, completed: boolean) => {
    const index = originalTaskList.findIndex((task) => task._id === ID);

    const updatedTaskList = [...originalTaskList];
    updatedTaskList[index].completed = !completed;

    const sorted = sortTasksByCompleted(updatedTaskList);
    const filtered = filteredTasks(sorted);
    setTaskList(filtered);

    // setTrigger(!trigger);

    const message = await fetchWithAuth(`/api/tasks/${ID}`, Methods.PUT, {
      completed: !completed,
    });

    // ! handle error and reverse the changes.
    if (!message) {
      setOrginalTaskList(originalTaskList);
      setTaskList(filteredTasks(originalTaskList));
    } else {
      setOrginalTaskList(updatedTaskList);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const trimmedTask = newTask.trim();

      if (trimmedTask === "") {
        toast.warning("Task cannot be empty!");
        return;
      }

      const task: TaskTypeResponse = {
        title: newTask,
        completed: false,
        user: user?.userId,
      };

      if (listName) {
        const selectedList = { _id: listName._id, name: listName.name };
        task.selectedListItem = selectedList;
      }

      if (taskDate === TaskDateCategory.TODAY) {
        const date = new Date();
        console.log(date);
        task.dueDate = date;
      }

      const updatedTaskList = [...originalTaskList, task];
      const sorted = sortTasksByCompleted(updatedTaskList);
      const filtered = filteredTasks(sorted);
      setTaskList(filtered);
      setNewTask("");

      const message = await fetchWithAuth<TaskTypeResponse>(
        "/api/tasks",
        Methods.POST,
        task
      );

      // !handle error
      if (!message || message.error) {
        setOrginalTaskList(originalTaskList);
        const sorted = sortTasksByCompleted(originalTaskList);
        const filtered = filteredTasks(sorted);
        setTaskList(filtered);
        if (message.error) {
          toast.error(message.error);
        } else {
          toast.error("Task not added, Try again!");
        }
      } else {
        task._id = message._id;
        setOrginalTaskList(updatedTaskList);
      }

      // trigger
      // setTrigger(!trigger);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleEdit = async (ID: string, task: TaskTypeResponse) => {
    const newTaskList = [...originalTaskList];

    const newTask = newTaskList.filter((task) => task._id === ID)[0];

    newTask.title = task.title;
    newTask.dueDate = task.dueDate && task.dueDate;
    newTask.tags = task.tags;
    newTask.subTasks = task.subTasks || [];
    newTask.description = task.description;

    if (task.selectedListItem) {
      newTask.selectedListItem = task.selectedListItem;
    }

    const message = await fetchWithAuth(
      `/api/tasks/${ID}`,
      Methods.PUT,
      newTask
    );

    if (!message) {
      toast.error("Task not updated. Try again!");
      return;
    }

    setTrigger(!trigger);

    toast.success("Changes Saved!");
  };

  const handleDeleteAll = async () => {
    closeDotMenu();
    const response = await fetchWithAuth<DeleteResponse>(
      "/api/tasks",
      Methods.DELETE
    );

    if (!response || response.deletedTasks.deletedCount === 0) {
      toast.warn("No tasks were deleted");
    } else {
      toast.info(`All tasks deleted (${response.deletedTasks.deletedCount})`);
    }
    setTrigger(!trigger);
  };

  const handleEditTagsClick = () => {
    openEditMenu();
    closeDotMenu();
  };

  const handleTagClick = (ID: string) => {
    const isAppliedAlready = appliedTags.find((t) => t._id === ID);
    if (isAppliedAlready) {
      return;
    }

    const localTags = availableTags;
    const tag = localTags.find((t) => t._id === ID);
    if (!tag) {
      return;
    }

    const index =
      (appliedTags && appliedTags.findIndex((tag) => tag._id === ID)) || -1;

    if (index !== -1) return;

    if (!appliedTags || !appliedTags.length) {
      setAppliedTags([tag]);
      setLocalStorageItem("appliedTags", [tag]);
    } else {
      setAppliedTags([tag, ...appliedTags]);
      setLocalStorageItem("appliedTags", [tag, ...appliedTags]);
    }
  };

  const handleTagClear = (ID: string) => {
    const localFilteredTags =
      getLocalStorageItem<TagType[]>("appliedTags") || [];
    const index = localFilteredTags.findIndex((tag) => tag._id === ID);

    if (index === -1) {
      return;
    }

    const newAppliedTags = [
      ...appliedTags.slice(0, index),
      ...appliedTags.slice(index + 1),
    ];
    setAppliedTags(newAppliedTags);
    setLocalStorageItem("appliedTags", newAppliedTags);
  };

  const clearAllAppliedTags = () => {
    setAppliedTags([]);
    setLocalStorageItem("appliedTags", []);
    closeDotMenu();
  };

  return (
    <div className="flex flex-col text-text xl:flex-row h-full ">
      <div className="flex-1 bg-background h-full p-5">
        <h1 className="text-4xl font-bold ">{listName && listName.name}</h1>

        {taskDate && (
          <h1 className="text-4xl font-bold ">
            {!!taskDate && taskDate === "TODAY"
              ? `Today, ${new Date().getDate()}`
              : "Upcoming"}
          </h1>
        )}
        <h1 className="text-4xl font-bold ">{searchQuery && searchQuery}</h1>

        {/* form */}
        <form className="flex border-2 rounded-xl mt-5" onSubmit={handleSubmit}>
          <button className="p-2" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-text"
              // fill-disabled
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </button>
          <input
            name="task"
            className="disabled:placeholder:text-gray-500 disabled:bg-gray-4000 p-2 w-full bg-transparent focus:outline-none placeholder:text-text"
            type="text"
            placeholder="add a new task"
            value={newTask}
            autoComplete="off"
            onChange={handleInputChange}
            disabled={!!searchQuery || taskDate === TaskDateCategory.UPCOMING}
          />
        </form>

        {/* tags */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {appliedTags &&
              appliedTags.map((tag) => (
                <div
                  key={tag._id}
                  className=" inline-flex gap-2 bg-amber-3000 p-2 m-2 bg-accent"
                >
                  <p>{tag.name}</p>
                  <button onClick={() => handleTagClear(tag._id || "")}>
                    {crossIcon}
                  </button>
                </div>
              ))}
          </div>
          {/*  */}
          {/*  */}
          {/*  */}

          <div className="flex flex-col bg-amber-3000 py-3">
            <div className="flex gap-5">
              <button onClick={toggleFilterTag} className="flex">
                {filterIcon} filter tags
              </button>

              <button className="" onClick={toggleDotMenu}>
                {dotsVerticalIcon}
              </button>
            </div>

            {isDotMenu && (
              <Modal
                isOpen={isDotMenu}
                onClose={closeDotMenu}
                fullScreen={false}
                closeOnOutsideClick={true}
              >
                <div className="relative h-0  ">
                  <div className="flex flex-col bg-accent gap-2 p-2">
                    <button
                      className="bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
                      onClick={clearAllAppliedTags}
                    >
                      clear tags
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      // className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      delete tasks
                    </button>

                    <button
                      onClick={handleEditTagsClick}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      edit tags
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
          {isEditTagMenu && (
            <Modal
              isOpen={isEditTagMenu}
              onClose={closeEditMenu}
              fullScreen={true}
              closeOnOutsideClick={true}
            >
              <div className="bg-primary">
                <div className="flex justify-between p-4">
                  <h3 className="font-semibold text-xl">Edit Tags</h3>
                  <button onClick={closeEditMenu}>{crossIcon}</button>
                </div>

                <Tags />
              </div>
            </Modal>
          )}
        </div>

        {isFilterTag && (
          <div className="w-full bg-accent flex  justify-between items-start p-2 rounded ">
            <div className="flex gap-2 py-2 flex-wrap">
              {availableTags &&
                availableTags.map((tag) => (
                  <button
                    key={tag._id}
                    onClick={() => handleTagClick(tag._id || "")}
                    className="bg-secondary rounded p-2"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
            <button onClick={closeFilterTag}>{crossIcon}</button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <main className="">
            {taskList.length > 0 ? (
              taskList.map((task, index) => (
                <Task
                  key={index}
                  task={task}
                  index={index}
                  handleDelete={handleDelete}
                  handleToggle={handleToggle}
                  handleEdit={handleEdit}
                  openSideModal={openSideModal}
                  updateCurrTask={updateCurrTask}
                />
              ))
            ) : (
              <h3 className="bg-red-3000 font-semibold text-center p-2">
                No tasks found!
              </h3>
            )}
          </main>
        )}
      </div>

      <div className="flex-1 h-screen xl:sticky top-0 px-10 flex0 justify-center0 items-center0">
        {isSideModal ? (
          <Modal
            isOpen={isSideModal}
            onClose={closeSideModal}
            fullScreen={isScreenBelowXL}
            closeOnOutsideClick={isScreenBelowXL}
          >
            <TaskDetailsForm
              key={count}
              closeModal={closeSideModal}
              handleEdit={handleEdit}
              task={currTask}
              index={0}
              handleDelete={handleDelete}
            />
          </Modal>
        ) : (
          <div className="hidden min-h-screen xl:flex justify-center p-5 font-semibold">
            <h2>Please open a task!</h2>
          </div>
        )}
      </div>

      <ToastContainer
        autoClose={2500}
        rtl={false}
        position="bottom-right"
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default TaskLIstControl;
