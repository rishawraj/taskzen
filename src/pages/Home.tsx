import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  text: string;
  completed: boolean;
}

export default function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  let sortedTasks: Task[];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTask.trim() !== "") {
      setTaskList([...taskList, { text: newTask, completed: false }]);
    }

    setNewTask("");
    // toast.success("new task added");
  };

  const handleDelete = (index: number) => {
    const updatedList = [...taskList];

    updatedList.splice(index, 1);
    setTaskList(updatedList);
    toast.info("task deleted successfully!");
  };

  const handleToggle = (index: number) => {
    const updatedList = [...taskList];

    updatedList[index].completed = !updatedList[index].completed;
    setTaskList(updatedList);

    if (updatedList[index].completed === true) {
      toast.success("Task Completed!");
    }

    sortedTasks = [...taskList].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setTaskList(sortedTasks);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  return (
    <>
      <div className="bg-blue-300 h-screen w-screen flex justify-center">
        <div className="w-full max-w-4xl bg-green-400">
          <nav className=" flex justify-between p-2 pt-4 bg-pink-200 sticky ">
            <h1 className="font-bold">Taskzen</h1>
            <Link className="font-bold" to="/login">
              Login
            </Link>
          </nav>

          <main>
            {taskList.map((task, index) => (
              <div
                key={index}
                className={
                  task.completed
                    ? "bg-cyan-500 flex justify-between m-5"
                    : "bg-red-400 flex justify-between m-5"
                }
              >
                <button
                  onClick={() => {
                    handleToggle(index);
                  }}
                >
                  {task.completed ? "completed" : "complete"}
                </button>
                <p>{task.text}</p>
                <button
                  onClick={() => {
                    handleDelete(index);
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          </main>

          <form
            className="bg-yellow-500 p-2 flex flex-col fixed bottom-0 w-full max-w-4xl"
            onSubmit={handleSubmit}
          >
            <input
              className="p-2 border-2 border-black"
              type="text"
              placeholder="add a new task"
              value={newTask}
              onChange={handleInputChange}
            />
            <button
              className="p-2 bg-white mt-4 border-2 border-green-400"
              type="submit"
            >
              add
            </button>
          </form>

          <footer>Footer</footer>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
