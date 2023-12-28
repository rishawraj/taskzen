import { useState } from "react";

function TaskForm({ index, task, handleEdit }: TaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [list, setList] = useState(task.list);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [tags, setTags] = useState(task.tags);

  const [subTaskList, setSubTaskList] = useState(task.subTasks || []);
  const [newSubTask, setNewSubTask] = useState<SubTaskType>({
    title: "",
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setSubTasks(subTaskList);

    const updatedTask: TaskType = {
      title: title,
      completed: task.completed,
      description: description,
      list: list,
      dueDate: dueDate,
      tags: tags,
      subTasks: subTaskList,
    };

    handleEdit(index, updatedTask);
  };

  const handleSubTaskFormSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!newSubTask.title) return;

    setSubTaskList([...subTaskList, newSubTask]);
    setNewSubTask({ title: "", completed: false });
  };

  return (
    <>
      <div className="text-text">
        <div>TaskForm</div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* <p>{task && task.title}</p> */}
          {/* title */}
          <p>{title}</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* desc */}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* list */}
          <label htmlFor="list">List</label>
          <select id="list" name="list">
            {list &&
              list.map((listItem) => {
                return <option value={listItem}>{listItem}</option>;
              })}
          </select>
          {/* due back */}
          <label htmlFor="dueDate">Due date</label>
          <input
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            name="dueDate"
            id="dueDate"
          />

          {/* tags */}
          <label>Tags</label>
          {tags && tags.map((tag) => <p>{tag}</p>)}
          <button>+ add tags</button>

          {/* subtask */}
          <h2>Subtasks:</h2>
          <div className="flex border-2 rounded-xl">
            <button className="p-2" onClick={handleSubTaskFormSubmit}>
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
              className="p-2 w-full bg-transparent focus:outline-none text-text"
              type="text"
              placeholder="Add New Subtask"
              value={newSubTask?.title}
              autoComplete="off"
              // onChange={(e) => setNewSubTask({title:e.target.value})}\
              onChange={(e) =>
                setNewSubTask({ ...newSubTask, title: e.target.value })
              }
              // onChange={handleInputChange}
            />
          </div>
          {subTaskList.map((subTask) => (
            <div className="flex bg-accent">
              <input type="checkbox" checked={subTask.completed} />
              <p>{subTask.title}</p>
            </div>
          ))}

          {/*  */}
          <button type="submit">Save Changes</button>
        </form>

        <br />
        <br />
        <br />
        <hr />
        <br />
      </div>
    </>
  );
}

export default TaskForm;
