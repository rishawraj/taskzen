import { useEffect } from "react";
import { TaskProps } from "../types/types";

function Task({
  index,
  task,
  handleDelete,
  handleToggle,
  openSideModal,
  updateCurrTask,
}: TaskProps) {
  const handleSideModalOpen = () => {
    updateCurrTask(task._id || "");
    openSideModal();
  };
  useEffect(() => {
    console.log(task.dueDate);
    if (!task.dueDate) {
      return;
    }

    const dueDate = new Date(task.dueDate);

    console.log(formatDate(dueDate));

    const formattedDueDate = dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    console.log(formattedDueDate);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return;
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <div>
        <div className="bg-secondary my-3 flex justify-between px-5 py-2 gap-3 w-full text-text border-2 rounded">
          <div className="flex gap-3">
            <input
              type="checkbox"
              name={`check-${index}`}
              id={`check-${index}`}
              checked={task.completed}
              onChange={() => handleToggle(task._id || "", !!task.completed)}
            />

            <p>{task.title}</p>

            {task.dueDate && <p>{formatDate(new Date(task.dueDate))}</p>}

            {task.selectedListItem && <p>{task.selectedListItem.name}</p>}
            {task.subTasks?.length ?? 0 >= 1 ? (
              <p className="bg-red-400 px-2">{task.subTasks!.length}</p>
            ) : (
              ""
            )}
          </div>

          <button onClick={handleSideModalOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-text"
            >
              <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
            </svg>
          </button>

          <button onClick={() => handleDelete(task?._id || "")}>delete</button>
        </div>
      </div>
    </>
  );
}

export default Task;
