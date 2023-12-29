import { useState } from "react";
import Modal from "./Modal";
import TaskForm from "./TaskForm";

function Task({
  index,
  task,
  handleToggle,
  handleDelete,
  handleEdit,
}: TaskProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className="bg-secondary my-3 flex justify-between px-5 py-2 gap-3 w-full text-text border-2 rounded">
        <div className="flex gap-3">
          <input
            type="checkbox"
            name={`check-${index}`}
            id={`check-${index}`}
            checked={task.completed}
            onChange={() => handleToggle(index)}
          />

          <p>{task.title}</p>

          {task.dueDate && <p>{task.dueDate}</p>}
          {task.subTasks?.length ?? 0 >= 1 ? (
            <p className="bg-red-400 px-2">{task.subTasks!.length}</p>
          ) : (
            ""
          )}
        </div>
        <button onClick={openModal}>
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
      </div>

      <Modal isOpen={modalOpen}>
        <TaskForm
          index={index}
          task={task}
          handleEdit={handleEdit}
          closeModal={closeModal}
        />

        <div className=" flex flex-col bg-background">
          {/* btns */}
          <div className="flex gap-4 bg-red-400">
            <button
              onClick={() => {
                handleDelete(index);
                closeModal();
              }}
            >
              delete
            </button>
            {/* <button onClick={closeModal}>close</button> */}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Task;
