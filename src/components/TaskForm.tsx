import { useEffect, useState } from "react";
import { getLocalStorageItem } from "../utils/localStorage";

function TaskForm({ index, task, handleEdit, closeModal }: TaskFormProps) {
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

  useEffect(() => {
    return () => {
      const tasks = getLocalStorageItem<TaskType[]>("tasks");
      const subTasks = tasks[index].subTasks || [];
      setSubTaskList(subTasks);
    };
  }, []);

  const handleModalClose = () => {
    closeModal();
  };

  const handleEscapeKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleModalClose(); // Call the function to close the modal
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  const handleSubmit = () => {
    console.log("handleSubmit called from taskform.tsx");
    const updatedTask: TaskType = {
      title: title,
      completed: task.completed,
      description: description,
      list: list,
      dueDate: dueDate,
      tags: tags,
      subTasks: subTaskList,
    };

    // saves it
    handleEdit(index, updatedTask);
  };

  const handleSubTaskFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newSubTask.title) return;

    setSubTaskList([newSubTask, ...subTaskList]);
    setNewSubTask({ title: "", completed: false });
  };

  const handleSubTaskToggle = (index: number) => {
    const newSubTaskList = [...subTaskList];

    newSubTaskList[index].completed = !newSubTaskList[index].completed;

    setSubTaskList(newSubTaskList);

    const sortedTasks = [...subTaskList].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setSubTaskList(sortedTasks);
  };

  const handleSubTaskDelete = (index: number) => {
    const updatedSubTaskList = [...subTaskList];
    updatedSubTaskList.splice(index, 1);
    setSubTaskList(updatedSubTaskList);
  };

  return (
    <>
      <div className="text-text">
        <div>TaskForm</div>

        <div className="flex flex-col gap-2">
          {/* <p>{task && task.title}</p> */}
          {/* title */}
          {/* <p>{title}</p> */}
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
          <form
            onSubmit={handleSubTaskFormSubmit}
            className="flex border-2 rounded-xl"
          >
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
              id="task"
              className="p-2 w-full bg-transparent focus:outline-none text-text"
              type="text"
              placeholder="Add New Subtask"
              value={newSubTask?.title}
              autoComplete="off"
              onChange={(e) =>
                setNewSubTask({ ...newSubTask, title: e.target.value })
              }
            />
          </form>

          {subTaskList.map((subTask, index) => (
            <div
              key={index}
              className="flex justify-between p-2 border-b-2 border-text "
            >
              <div className="flex gap-4">
                <p>{subTask.completed ? "1" : "0"}</p>
                <input
                  id={index.toString()}
                  type="checkbox"
                  checked={subTask.completed}
                  onChange={() => handleSubTaskToggle(index)}
                />
                <p>{subTask.title}</p>
              </div>
              <button onClick={() => handleSubTaskDelete(index)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-text"
                >
                  <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path>
                </svg>
              </button>
            </div>
          ))}

          {/*  */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-green-400 p-2 my-2"
          >
            Save Changes
          </button>
          <button onClick={handleModalClose}>close modal</button>
        </div>
      </div>
    </>
  );
}

export default TaskForm;
