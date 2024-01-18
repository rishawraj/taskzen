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

import { v4 as uuidv4 } from "uuid";
import TaskDetailsForm from "./TaskDetailsForm";
import Tags from "./Tags";
import { TaskType, TagType } from "../types/types";
import fetchWithAuth from "../utils/api";

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
  // const [originalTaskList, setOrginalTaskList] = useState<TaskType[]>(
  //   getLocalStorageItem<TaskType[]>("tasks") || []
  // );
  const [originalTaskList, setOrginalTaskList] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await fetchWithAuth<TaskType[]>("/api/tasks");
        console.log("result: ", result);
        setOrginalTaskList(result);
      } catch (error) {}
    };

    fetchTasks();
  }, []);

  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  const { isDarkMode } = useDarkMode();

  const [isDotMenu, setIsDotMenu] = useState(false);
  const [isSideModal, setIsSideModal] = useState(false);

  const [isScreenBelowXL, setIsScreenBelowXL] = useState(
    window.innerWidth < 1280
  );

  const [isEditTagMenu, setIsEditTagMenu] = useState(false);
  const closeEditMenu = () => setIsEditTagMenu(false);
  const openEditMenu = () => setIsEditTagMenu(true);

  const [trigger, setTrigger] = useState(false);
  const [count, setCount] = useState(0);
  const [currTask, setCurrTask] = useState<TaskType>();

  // const [filterTagsList, setFilterTagsList];

  const [appliedTags, setAppliedTags] = useState<TagType[]>(
    getLocalStorageItem<TagType[]>("appliedTags") || []
  );

  // const [taglist, setTagList];

  const [availableTags, setAvailableTags] = useState(
    getLocalStorageItem<TagType[]>("tags") || []
  );

  useEffect(() => {
    setAvailableTags(getLocalStorageItem<TagType[]>("tags"));
    setAppliedTags(getLocalStorageItem<TagType[]>("appliedTags"));
  }, [isEditTagMenu]);

  const [isFilterTag, setIsFilterTag] = useState(false);
  // const openFilterTag = () => setIsFilterTag(true);
  const closeFilterTag = () => setIsFilterTag(false);
  const toggleFilterTag = () => setIsFilterTag((prev) => !prev);

  const updateCurrTask = (ID: string) => {
    const tasks = getLocalStorageItem<TaskType[]>("tasks");
    const task = tasks.find((t) => t.id === ID);
    setCurrTask(task);
    setCount((prevCount) => prevCount + 1);
  };

  const closeSideModal = () => setIsSideModal(false);
  const openSideModal = () => setIsSideModal(true);

  const closeDotMenu = () => setIsDotMenu(false);
  // const openDotMenu = () => setIsDotMenu(true);
  const toggleDotMenu = () => setIsDotMenu((prev) => !prev);

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

  const dateToday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
    const currentDate = String(today.getDate()).padStart(2, "0");

    // Display the current date in the desired format
    return currentYear + "-" + currentMonth + "-" + currentDate;
  };

  const filterTaskListByAppliedTags = (
    taskList: TaskType[],
    tagList: TagType[]
  ): TaskType[] => {
    if (!tagList || !tagList.length) {
      return taskList;
    }

    const filteredTaskList: TaskType[] = [];

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

  const filteredTasks = () => {
    let taskList = originalTaskList;

    if (listName) {
      taskList = originalTaskList.filter(
        (task) => task.selectedListItem === listName
      );
    } else if (taskDate === TaskDateCategory.UPCOMING) {
      taskList = originalTaskList.filter((task) => task.dueDate !== undefined);
    } else if (taskDate === TaskDateCategory.TODAY) {
      console.log();
      taskList = originalTaskList.filter((task) => {
        console.log(task.dueDate, dateToday());
        return task.dueDate === dateToday();
      });
    }

    const filteredTasks = filterTaskListByAppliedTags(taskList, appliedTags);
    console.log(filteredTasks);

    return filteredTasks;
  };

  useEffect(() => {
    if (searchQuery != undefined && searchQuery !== "") {
      // console.log("search query", searchQuery);
      const task = originalTaskList.filter(
        (task) => task.title === searchQuery
      );
      setTaskList(task);
    } else {
      setTaskList(filteredTasks());
    }
  }, [listName, taskDate, trigger, appliedTags]);

  const handleDelete = (ID: string) => {
    const newOriginalTaskList = originalTaskList.filter(
      (task) => task.id !== ID
    );

    //? setTaskList & do not trigger useEffect

    setOrginalTaskList(newOriginalTaskList);
    setLocalStorageItem("tasks", newOriginalTaskList);

    setTrigger(!trigger);

    return;
  };

  const handleToggle = (ID: string) => {
    console.log(ID);

    const localTaskList = getLocalStorageItem<TaskType[]>("tasks") || [];

    const updatedList = localTaskList.map((task) =>
      task.id === ID ? { ...task, completed: !task.completed } : task
    );

    // console.log("hi");
    // const updatedList = [...localTaskList];

    // const newlist = updatedList.map((task) => task.id === ID);

    // updatedList[index].completed = !updatedList[index].completed;

    const sortedTasks = [...updatedList].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setOrginalTaskList(sortedTasks);
    setLocalStorageItem("tasks", sortedTasks);

    setTrigger(!trigger);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const localTaskList = getLocalStorageItem<TaskType[]>("tasks") || [];
    console.log(newTask);

    const trimmedTask = newTask.trim();

    if (trimmedTask === "") {
      toast.warning("Task cannot be empty!");
      return;
    }

    if (localTaskList.some((task) => task.title === trimmedTask)) {
      toast.warning("Task already exists!");
      return;
    }
    const Uuid = uuidv4();

    const newTaskList: TaskType[] = [
      {
        title: newTask,
        completed: false,
        id: Uuid,
        selectedListItem: listName,
      },
      ...localTaskList,
    ].sort((a, b): number => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setLocalStorageItem("tasks", newTaskList);
    setOrginalTaskList(newTaskList);

    setTrigger(!trigger);

    // setTaskList(newTaskList);

    // console.log(newTaskList[0]);

    setNewTask("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleEdit = (ID: string, task: TaskType) => {
    const localTaskList = getLocalStorageItem<TaskType[]>("tasks");

    const newTaskList = [...localTaskList];

    const newTask = newTaskList.filter((task) => task.id === ID)[0];
    console.log(newTask);

    // const newTask = newTaskList[index];

    newTask.id = task.id;
    newTask.title = task.title;
    newTask.description = task.description;
    newTask.selectedListItem = task.selectedListItem;
    newTask.dueDate = task.dueDate;
    newTask.tags = task.tags;
    newTask.subTasks = task.subTasks;

    setOrginalTaskList(newTaskList);
    setLocalStorageItem("tasks", newTaskList);
    // setTaskList(newTaskList);
    setTrigger(!trigger);

    toast.success("Changes Saved!");
  };
  const handleDeleteAll = () => {
    setTaskList([]);
    setLocalStorageItem("tasks", []);
    closeDotMenu();
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

        {/* {availableTags.map((t) => (
          <p>{t.name}</p>
        ))} */}

        {/* task List */}
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
              // treat it like a new element
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
