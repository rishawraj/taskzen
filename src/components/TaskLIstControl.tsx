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
import { DeleteResponse, TagType, TaskTypeResponse } from "../types/types";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../Context/AuthContext";

enum TaskDateCategory {
  UPCOMING = "UPCOMING",
  TODAY = "TODAY",
}

interface TaskLIstControlProps {
  listName?: string;
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

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  //fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const result = await fetchWithAuth<TaskTypeResponse[]>("/api/tasks");
        setOrginalTaskList(result);

        const sorted = sortTasksByCompleted(result);
        const filtered = filteredTasks(sorted);
        setTaskList(filtered);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Tags
  useEffect(() => {
    setAvailableTags(getLocalStorageItem<TagType[]>("tags"));
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
    fetchWithAuth<TaskTypeResponse[]>("/api/tasks").then((data) => {
      setOrginalTaskList(data);
      const sorted = sortTasksByCompleted(data);
      const filtered = filteredTasks(sorted);
      setTaskList(filtered);
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

  const dateToday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const currentDate = String(today.getDate()).padStart(2, "0");

    return currentYear + "-" + currentMonth + "-" + currentDate;
  };

  // !

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

  // !

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
          const tagPresent = task.tags.some((taskTag) => taskTag.id === tag.id);

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
      taskList = inputTaskList.filter((task) => task.title === searchQuery);
    } else if (listName) {
      taskList = originalTaskList.filter(
        (task) => task.selectedListItem === listName
      );
    } else if (taskDate === TaskDateCategory.UPCOMING) {
      taskList = originalTaskList.filter((task) => task.dueDate !== undefined);
    } else if (taskDate === TaskDateCategory.TODAY) {
      taskList = originalTaskList.filter((task) => {
        console.log(task.dueDate, dateToday());
        return task.dueDate === dateToday();
      });
    }

    const filteredTasks = filterTaskListByAppliedTags(taskList, appliedTags);

    return filteredTasks;
  };

  const handleDelete = async (ID: string) => {
    const message = await fetchWithAuth(`/api/tasks/${ID}`, Methods.DELETE);
    console.log(message);

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

    // const sorted = sortTasksByCompleted(updatedTaskList);
    // const filtered = filteredTasks(sorted);
    // setTaskList(filtered);

    setTrigger(!trigger);

    const message = await fetchWithAuth(`/api/tasks/${ID}`, Methods.PUT, {
      completed: !completed,
    });

    // ! handle error and reverse the changes.
    if (!message) {
      setOrginalTaskList(originalTaskList);
      setTaskList(filteredTasks(originalTaskList));
    } else {
      setOrginalTaskList(updatedTaskList);
      toast.success("Task updated successfully!");
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
        selectedListItem: listName,
        user: user?.userId,
      };

      const updatedTaskList = [...originalTaskList, task];
      const sorted = sortTasksByCompleted(updatedTaskList);
      const filtered = filteredTasks(sorted);
      setTaskList(filtered);

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

      setNewTask("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleEdit = async (ID: string, task: TaskTypeResponse) => {
    // const localTaskList = getLocalStorageItem<TaskTypeResponse[]>("tasks");
    const localTaskList = originalTaskList;

    const newTaskList = [...localTaskList];

    const newTask = newTaskList.filter((task) => task._id === ID)[0];
    console.log(newTask);

    // const newTask = newTaskList[index];

    // newTask._id = task._id;
    newTask.title = task.title;
    newTask.description = task.description;
    if (!task.selectedListItem && task.selectedListItem !== "") {
      newTask.selectedListItem = task.selectedListItem;
    }
    newTask.dueDate = task.dueDate;
    newTask.tags = task.tags;
    newTask.subTasks = task.subTasks;

    const message = await fetchWithAuth(
      `/api/tasks/${ID}`,
      Methods.PUT,
      newTask
    );
    console.log(message);

    if (!message) {
      toast.error("Task not updated. Try again!");
      return;
    }

    setTrigger(!trigger);

    toast.success("Changes Saved!");
  };

  const handleDeleteAll = async () => {
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
    const localTags = getLocalStorageItem<TagType[]>("tags") || [];

    const tag = localTags.find((t) => t.id === ID);

    if (!tag) {
      return;
    }

    const index =
      (appliedTags && appliedTags.findIndex((tag) => tag.id === ID)) || -1;

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
    const index = localFilteredTags.findIndex((tag) => tag.id === ID);

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
  };

  return (
    <div className="flex flex-col xl:flex-row h-full ">
      <div className="flex-1 bg-amber-2000 h-full p-5">
        {/* form */}
        <form className="flex border-2 rounded-xl" onSubmit={handleSubmit}>
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
            disabled={!!searchQuery || !!taskDate}
          />
        </form>

        {/* tags */}
        <div className="flex items-center justify-between">
          <div>
            {appliedTags &&
              appliedTags.map((tag) => (
                <div
                  key={tag.id}
                  className=" inline-flex gap-2 bg-amber-3000 p-2 m-2"
                >
                  <p>{tag.name}</p>
                  <button onClick={() => handleTagClear(tag.id)}>
                    {crossIcon}
                  </button>
                </div>
              ))}
          </div>

          <div className="relative flex">
            <button onClick={toggleFilterTag} className="flex">
              {filterIcon} filter tags
            </button>

            <button onClick={toggleDotMenu}>{dotsVerticalIcon}</button>
            {isDotMenu && (
              <Modal
                isOpen={isDotMenu}
                onClose={closeDotMenu}
                fullScreen={false}
                closeOnOutsideClick={true}
              >
                <div className="absolute w-full top-10 left-0 z-10 flex flex-col p-2 gap-2 bg-background">
                  <button onClick={clearAllAppliedTags}>clear all tags</button>
                  <button
                    onClick={handleDeleteAll}
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    {/* Delete All Tasks */}
                    clear tasks
                  </button>
                  <button
                    onClick={handleEditTagsClick}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    edit tags
                  </button>
                </div>
              </Modal>
            )}
          </div>

          {isEditTagMenu && (
            <Modal
              isOpen={isEditTagMenu}
              onClose={closeEditMenu}
              fullScreen={true}
              closeOnOutsideClick={true}
            >
              <div className="">
                <div>
                  <h3>Edit Tags</h3>
                  <button onClick={closeEditMenu}>{crossIcon}</button>
                </div>

                {/*  */}
                <Tags />
              </div>
            </Modal>
          )}
        </div>

        {isFilterTag && (
          <div className="w-full h-10 bg-red-400 flex justify-between ">
            <div className="flex gap-2">
              {availableTags &&
                availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className="bg-amber-200 p-2"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
            <button onClick={closeFilterTag}>{crossIcon}</button>
          </div>
        )}

        {loading ? (
          <p>loading...</p>
        ) : (
          <main className="">
            {taskList &&
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
              ))}
          </main>
        )}
      </div>

      <div className="flex-1 h-screen xl:sticky top-0 px-10 bg-yellow-200">
        {isSideModal ? (
          <Modal
            isOpen={isSideModal}
            onClose={closeSideModal}
            fullScreen={isScreenBelowXL}
            closeOnOutsideClick={isScreenBelowXL}
          >
            <TaskDetailsForm
              // key: treat it like a new element
              key={count}
              closeModal={closeSideModal}
              handleEdit={handleEdit}
              task={currTask}
              index={0}
            />
          </Modal>
        ) : (
          <div className="hidden xl:flex bg-pink-400">
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
