import { useState } from "react";
import Modal from "./Modal";
import TaskDetailsForm from "./TaskDetailsForm";

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
            onChange={() => handleToggle(task.id)}
          />

          <p>{task.title}</p>

          {task.dueDate && <p>{task.dueDate}</p>}
          {task.selectedListItem && <p>{task.selectedListItem}</p>}
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
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <TaskDetailsForm
          index={index}
          task={task}
          handleEdit={handleEdit}
          closeModal={closeModal}
        />

        {/* btns */}
        <div>
          <button
            className="bg-red-400 p-2 my-2 w-full flex justify-center capitalize"
            onClick={() => {
              handleDelete(task.id);
              closeModal();
            }}
          >
            delete
          </button>
          {/* <button onClick={closeModal}>close</button> */}
        </div>
      </Modal>
    </>
  );
}

export default Task;
