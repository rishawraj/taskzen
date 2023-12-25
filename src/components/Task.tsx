interface Task {
  text: string;
  completed: boolean;
}

interface TaskProps {
  index: number;
  task: Task;
  handleToggle: (index: number) => void;
  handleDelete: (index: number) => void;
  handleEdit: (index: number) => void;
}

function Task({
  index,
  task,
  handleToggle,
  handleDelete,
  handleEdit,
}: TaskProps) {
  return (
    <div
      // className={`${
      //   task.completed ? "bg-cyan-800" : "bg-primary"
      // } flex justify-between m-5 p-2`}
      className="bg-primary my-3 flex justify-around gap-3 w-full border-0 border-gray-50 text-text"
    >
      <input
        // className=""
        type="checkbox"
        name="check"
        id="check"
        checked={task.completed}
        // onClick={() => handleToggle(index)}
        onChange={() => handleToggle(index)}
      />

      <p>{task.text}</p>
      <button
        onClick={() => {
          handleDelete(index);
        }}
      >
        delete
      </button>
      <button
        onClick={() => {
          handleEdit(index);
        }}
      >
        edit
      </button>
    </div>
  );
}

export default Task;
