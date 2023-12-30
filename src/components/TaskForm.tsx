import { useEffect, useState } from "react";
import { getLocalStorageItem } from "../utils/localStorage";

function TaskForm({ index, task, handleEdit, closeModal }: TaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [list, setList] = useState<string[]>([]);
  const [selectedListItem, setSelectedListItem] = useState(
    task.selectedListItem
  );
  const [dueDate, setDueDate] = useState(task.dueDate);

  const [taskTags, setTaskTags] = useState<string[]>(task.tags || []);

  const [tags, setTags] = useState<string[]>([]);
  const [tagListOpen, setTagLisOpen] = useState(false);

  const [subTaskList, setSubTaskList] = useState(task.subTasks || []);

  const [newSubTask, setNewSubTask] = useState<SubTaskType>({
    title: "",
    completed: false,
  });

  useEffect(() => {
    const localList = getLocalStorageItem<string[]>("list") || [];
    setList(localList);

    const localTags = getLocalStorageItem<string[]>("tags");
    setTags(localTags);
  }, []);

  const handleModalClose = () => {
    console.log("does this also gets run??");

    const tasks = getLocalStorageItem<TaskType[]>("tasks");
    const subTasks = tasks[index].subTasks || [];
    setSubTaskList(subTasks);
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

  const handleSubmit = () => {
    console.log("handleSubmit called from taskform.tsx");
    const updatedTask: TaskType = {
      title: title,
      completed: task.completed,
      description: description,
      // list: list,
      selectedListItem: selectedListItem,
      dueDate: dueDate,
      tags: taskTags,
      subTasks: subTaskList,
    };

    handleEdit(index, updatedTask);
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("selcted option");
    setSelectedListItem(e.target.value);
  };

  const handleAddTags = (index: number) => {
    if (taskTags.length === tags.length) return;

    const newTag = tags[index];
    const indexOfTag = taskTags.indexOf(newTag);

    if (indexOfTag >= 0) return;

    setTaskTags([...taskTags, tags[index]]);
  };

  const handleDeleteTaskTags = (index: number) => {
    const newTaskTags = [...taskTags];
    newTaskTags.splice(index, 1);
    setTaskTags(newTaskTags);
  };

  return (
    <>
      <div className="text-text">
        <div>TaskForm</div>

        <div className="flex flex-col gap-2">
          <input
            name="title"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* desc */}
          <input
            name="description"
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* list */}
          <label htmlFor="list">List</label>
          <select
            id="list"
            name="list"
            value={selectedListItem}
            onChange={handleListChange}
          >
            <option value="">Select an option</option>
            {list &&
              list.map((listItem, i) => {
                return (
                  <option key={i} value={listItem}>
                    {listItem}
                  </option>
                );
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
          <div>
            {taskTags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex flex-wrap gap-2 p-2 bg-amber-300 mr-2"
              >
                <p>{tag}</p>
                <button onClick={() => handleDeleteTaskTags(index)}>X</button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {tagListOpen &&
              tags &&
              tags.map((tag, i) => (
                <button
                  onClick={() => handleAddTags(i)}
                  className="py-2 bg-lime-300 min-w-[70px]"
                  key={i}
                >
                  {tag}
                </button>
              ))}
            <button
              onClick={() => setTagLisOpen(!tagListOpen)}
              className="p-2 bg-fuchsia-300"
            >
              + add tags
            </button>
          </div>

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

          {subTaskList.map((subTask, i) => (
            <div
              key={i}
              className="flex justify-between p-2 border-b-2 border-text "
            >
              <div className="flex gap-4">
                <p>{subTask.completed ? "1" : "0"}</p>
                <input
                  id={i.toString()}
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
