// import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Task from "../components/Task";
import NavBar from "../components/NavBar";

interface TaskType {
  text: string;
  completed: boolean;
}

export default function Home() {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTask.trim() === "") {
      return;
    }

    const newTaskList = [{ text: newTask, completed: false }, ...taskList].sort(
      (a, b): number => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      }
    );
    setTaskList(newTaskList);

    setNewTask("");
  };

  const handleDelete = (index: number) => {
    const updatedList = [...taskList];

    updatedList.splice(index, 1);
    setTaskList(updatedList);
  };

  const handleToggle = (index: number) => {
    const updatedList = [...taskList];

    updatedList[index].completed = !updatedList[index].completed;
    setTaskList(updatedList);

    const sortedTasks = [...taskList].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setTaskList(sortedTasks);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleEdit = (index: number) => {
    console.log(index);
    //todo
  };

  return (
    <>
      <div className="h-screen w-full flex flex-col md:flex-row md:justify-between bg-background text-text p-3">
        <div className="lg:w-1/6">
          <NavBar />
        </div>
        <div className="lg:w-full md:w-2/3">
          <form className="flex border-2 rounded-xl" onSubmit={handleSubmit}>
            <button className="p-2" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-text"
                // stroke="text-text"
                // width="3"
              >
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
              </svg>
            </button>
            <input
              name="task"
              className="p-2 w-full bg-transparent focus:outline-none"
              type="text"
              placeholder="add a new task"
              value={newTask}
              autoComplete="off"
              onChange={handleInputChange}
            />
          </form>
          <main className="mb-40">
            {taskList.map((task, index) => (
              <Task
                key={index}
                task={task}
                index={index}
                handleDelete={handleDelete}
                handleToggle={handleToggle}
                handleEdit={handleEdit}
              />
            ))}
          </main>
        </div>

        <div className="hidden lg:flex bg-accent w-3/6"></div>
      </div>
      <ToastContainer />
    </>
  );
}
