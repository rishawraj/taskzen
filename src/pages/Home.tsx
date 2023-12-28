import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Task from "../components/Task";
import NavBar from "../components/NavBar";

export default function Home() {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTask.trim() === "") {
      return;
    }

    const newTaskList = [
      { title: newTask, completed: false },
      ...taskList,
    ].sort((a, b): number => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
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

  //todo
  const handleEdit = (index: number, task: TaskType) => {
    console.log(task);
    const newTaskList = [...taskList];
    const newTask = newTaskList[index];

    newTask.title = task.title;
    newTask.description = task.description;
    newTask.list = task.list;
    newTask.dueDate = task.dueDate;
    newTask.tags = task.tags;
    newTask.subTasks = task.subTasks;

    setTaskList(newTaskList);
  };

  return (
    <>
      <div className="h-full min-h-screen w-full flex flex-col md:flex-row md:justify-between bg-background text-text p-3">
        <div className="lg:w-2/6">
          <NavBar />
        </div>
        <div className="lg:w-full md:w-2/3 xl:2/6">
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
          <main className="">
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

        <div className="hidden xl:flex bg-accent w-4/6"></div>
      </div>

      <ToastContainer />
    </>
  );
}
