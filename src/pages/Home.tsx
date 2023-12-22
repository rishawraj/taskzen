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
      <div>
        <div className="bg-background">
          <NavBar />

          <form
            className="flex border-2 border-gray-50"
            onSubmit={handleSubmit}
          >
            <button className="p-2" type="submit">
              +
            </button>
            <input
              name="task"
              className="p-2 w-full focus:outline-none"
              type="text"
              placeholder="add a new task"
              value={newTask}
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

          {/* <footer>Footer</footer> */}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
