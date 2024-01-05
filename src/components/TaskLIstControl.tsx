import { useState, useEffect } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";
import Task from "./Task";
import { ToastContainer, toast } from "react-toastify";
import { crossIcon, dotsVertical, filterIcon } from "../assets/icons";

import { useDarkMode } from "../Context/DarkModeContext";
import Modal from "./Modal";

import { v4 as uuidv4 } from "uuid";
import TaskDetailsForm from "./TaskDetailsForm";

interface TaskLIstControlProps {
  listName?: string;
}

function TaskLIstControl({ listName }: TaskLIstControlProps) {
  const [originalTaskList, setOrginalTaskList] = useState<TaskType[]>(
    getLocalStorageItem<TaskType[]>("tasks") || []
  );
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  const { isDarkMode } = useDarkMode();

  const [isDotMenu, setIsDotMenu] = useState(false);
  const [isSideModal, setIsSideModal] = useState(false);

  const [isScreenBelowXL, setIsScreenBelowXL] = useState(
    window.innerWidth < 1280
  );
  const [trigger, setTrigger] = useState(false);
  const [count, setCount] = useState(0);
  const [currTask, setCurrTask] = useState<TaskType>();

  const updateCurrTask = (ID: string) => {
    const tasks = getLocalStorageItem<TaskType[]>("tasks");
    const task = tasks.find((t) => t.id === ID);
    setCurrTask(task);
    setCount((prevCount) => prevCount + 1);
  };

  const closeSideModal = () => setIsSideModal(false);
  const openSideModal = () => setIsSideModal(true);

  const closeDotMenu = () => setIsDotMenu(false);
  const openDotMenu = () => setIsDotMenu(true);

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

  useEffect(() => {
    const filteredTasks = listName
      ? originalTaskList.filter((task) => task.selectedListItem === listName)
      : originalTaskList;

    setTaskList(filteredTasks);
  }, [listName, trigger]);

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

  return (
    <div className="flex flex-col xl:flex-row ">
      <div className="flex-grow p-5 mt-5">
        {/* form */}
        <form className="flex border-2 rounded-xl" onSubmit={handleSubmit}>
          <button className="p-2" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-text"
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </button>
          <input
            name="task"
            className="p-2 w-full bg-transparent focus:outline-none placeholder:text-text"
            type="text"
            placeholder="add a new task"
            value={newTask}
            autoComplete="off"
            onChange={handleInputChange}
          />
        </form>

        {/* tags */}
        <div className="flex items-center justify-between px-2">
          <div>
            <div className=" inline-flex gap-2 bg-amber-3000 p-2 m-2">
              <p>tag1</p>
              <button>{crossIcon}</button>
            </div>
            <div className=" inline-flex gap-2 bg-rose-3000 p-2 m-2">
              <p>tag1</p>
              <button>{crossIcon}</button>
            </div>
          </div>

          <div className="relative flex gap-2">
            <button className=" flex">{filterIcon} filter tags</button>
            <button onClick={openDotMenu}>{dotsVertical}</button>
            {isDotMenu && (
              <Modal
                isOpen={isDotMenu}
                onClose={closeDotMenu}
                fullScreen={false}
              >
                <div className="absolute flex justify-center w-40 top-8 right-0 py-4 rounded  bg-red-200">
                  <button
                    onClick={handleDeleteAll}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete All Tasks
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>

        {/* task List */}
        <main className="">
          {taskList.map((task, index) => (
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

      <div className="bg-purple-400 relative flex-grow min-w-[400px]">
        {isSideModal ? (
          <Modal
            isOpen={isSideModal}
            onClose={closeSideModal}
            fullScreen={isScreenBelowXL}
          >
            <TaskDetailsForm
              // new element
              key={count}
              closeModal={closeSideModal}
              handleEdit={handleEdit}
              task={currTask}
              index={0}
            />
          </Modal>
        ) : (
          <div className="hidden xl:block">
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
