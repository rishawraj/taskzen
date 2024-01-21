import { useEffect, useState } from "react";
import { getLocalStorageItem } from "../utils/localStorage";
import { crossIcon } from "../assets/icons";
import { v4 as uuidv4 } from "uuid";
import {
  TagType,
  TaskFormProps,
  TaskType,
  TaskTypeResponse,
} from "../types/types";

function TaskDetailsForm({
  index,
  task,
  handleEdit,
  closeModal,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [list, setList] = useState<string[]>([]);
  const [selectedListItem, setSelectedListItem] = useState(
    task?.selectedListItem || ""
  );
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  const [taskTags, setTaskTags] = useState<TagType[]>(task?.tags || []);

  const [tags, setTags] = useState<TagType[]>([]);
  const [tagListOpen, setTagLisOpen] = useState(false);

  const [subTaskList, setSubTaskList] = useState(task?.subTasks || []);

  const [newSubTaskText, setNewSubTaskText] = useState("");

  useEffect(() => {
    const localList = getLocalStorageItem<string[]>("list") || [];
    setList(localList);

    const localTags = getLocalStorageItem<TagType[]>("tags");
    setTags(localTags);
  }, []);

  const handleModalClose = () => {
    console.log("does this also gets run??");

    const tasks = getLocalStorageItem<TaskType[]>("tasks");
    const subTasks = tasks[index].subTasks || [];
    setSubTaskList(subTasks);
    closeModal();
  };

  // to modal.tsx
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

    if (!newSubTaskText) return;

    const t = subTaskList?.find((t) => t.title === newSubTaskText);
    if (t !== undefined) {
      return;
    }

    const newSubTask = {
      id: uuidv4(),
      title: newSubTaskText,
      completed: false,
    };

    setSubTaskList([newSubTask, ...subTaskList]);
    setNewSubTaskText("");
  };

  const handleSubTaskToggle = (ID: string) => {
    const newSubTaskList = [...subTaskList];

    const subTaskIndex = newSubTaskList.findIndex((subT) => subT.id === ID);

    if (subTaskIndex === -1) return;

    const updatedSubTask = { ...newSubTaskList[subTaskIndex] };

    updatedSubTask.completed = !updatedSubTask.completed;

    newSubTaskList[subTaskIndex] = updatedSubTask;

    const sortedTasks = [...newSubTaskList].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

    setSubTaskList(sortedTasks);
  };

  const handleSubTaskDelete = (ID: string) => {
    const index = subTaskList.findIndex((subT) => subT.id === ID);

    if (index === -1) return;

    const updatedSubTaskList = [
      ...subTaskList.slice(0, index),
      ...subTaskList.slice(index + 1),
    ];

    setSubTaskList(updatedSubTaskList);
  };

  const handleSubmit = () => {
    // console.log("handleSubmit called from taskform.tsx");

    const updatedTask: TaskTypeResponse = {
      // id: task.id,
      // id: task!.id,

      title: title,
      completed: task!.completed,
      description: description,
      // list: list,
      selectedListItem: selectedListItem,
      dueDate: dueDate,
      tags: taskTags,
      subTasks: subTaskList,
    };

    handleEdit(task?._id || "", updatedTask);
    closeModal();
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("selcted option");
    setSelectedListItem(e.target.value);
  };

  const handleAddTags = (ID: string) => {
    if (taskTags.length === tags.length) return;

    const tg = tags.find((t) => t.id === ID);
    if (!tg) return;

    setTaskTags([...taskTags, tg]);
  };

  const handleDeleteTaskTags = (ID: string) => {
    const index = taskTags.findIndex((t) => t.id === ID);

    if (index === -1) return;

    const newTaskTagList = [
      ...taskTags.slice(0, index),
      ...taskTags.slice(index + 1),
    ];

    setTaskTags(newTaskTagList);
  };

  return (
    <>
      <div className="text-text">
        <div className="flex justify-between my-2">
          <div>TaskForm</div>
          <button onClick={closeModal}>{crossIcon}</button>
        </div>

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
            {taskTags &&
              taskTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex flex-wrap gap-2 p-2 bg-amber-300 mr-2"
                >
                  <p>{tag.name}</p>
                  <button onClick={() => handleDeleteTaskTags(tag.id)}>
                    {crossIcon}
                  </button>
                </span>
              ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {tagListOpen &&
              tags &&
              tags.map((tag) => (
                <button
                  onClick={() => handleAddTags(tag.id)}
                  className="py-2 bg-lime-300 min-w-[70px]"
                  key={tag.id}
                >
                  {tag.name}
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
              value={newSubTaskText}
              autoComplete="off"
              onChange={(e) => setNewSubTaskText(e.target.value)}
            />
          </form>

          {subTaskList &&
            subTaskList.map((subTask, i) => (
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
                    onChange={() => handleSubTaskToggle(subTask.id)}
                  />
                  <p>{subTask.title}</p>
                </div>
                <button onClick={() => handleSubTaskDelete(subTask.id)}>
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
        </div>
      </div>
    </>
  );
}

export default TaskDetailsForm;
