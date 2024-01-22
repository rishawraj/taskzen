import { useEffect, useState } from "react";
import { crossIcon } from "../assets/icons";
// import { getLocalStorageItem } from "../utils/localStorage";
// import { v4 as uuidv4 } from "uuid";
import {
  ListResponse,
  TagType,
  TaskFormProps,
  TaskTypeResponse,
  SubTaskType,
} from "../types/types";
import { fetchWithAuth } from "../utils/fetchWithAuth";

function TaskDetailsForm({
  index,
  task,
  handleEdit,
  closeModal,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const [list, setList] = useState<ListResponse[]>([]);
  const [currListItem, setCurrListItem] = useState<ListResponse>();

  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  const [selectedListItem, setSelectedListItem] = useState(
    task?.selectedListItem || ""
  );

  const [taskTags, setTaskTags] = useState<TagType[]>([]);

  const [tags, setTags] = useState<TagType[]>([]);

  const [tagListOpen, setTagLisOpen] = useState(false);

  const [subTaskList, setSubTaskList] = useState(task?.subTasks || []);
  const [newSubTaskText, setNewSubTaskText] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetchWithAuth<ListResponse[]>("/api/lists");
      setList(response);
    };
    const fetchTags = async () => {
      const response = await fetchWithAuth<TagType[]>("/api/tags");
      setTags(response);
    };

    const fetchTaskTags = async () => {
      const response = await fetchWithAuth<TagType[]>(
        `/api/tasks/${task?._id}/tags`
      );
      setTaskTags(response || []);
    };

    const fetchCurrList = async () => {
      if (!task?.selectedListItem) {
        return;
      }
      const response = await fetchWithAuth<ListResponse>(
        `/api/lists/${task?.selectedListItem}`
      );
      console.log(response);
      setCurrListItem(response);
    };

    fetchLists();
    fetchTags();
    fetchTaskTags();
    fetchCurrList();
  }, []);

  const handleModalClose = async () => {
    console.log("does this also gets run??");

    //! api call
    const tasks = await fetchWithAuth<TaskTypeResponse[]>("/api/tasks");
    const subTasks = tasks[index].subTasks || [];
    setSubTaskList(subTasks);
    closeModal();
  };

  //todo to modal.tsx
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

    const newSubTask: SubTaskType = {
      title: newSubTaskText,
      completed: false,
    };

    setSubTaskList([newSubTask, ...subTaskList]);
    setNewSubTaskText("");
  };

  const handleSubTaskToggle = (ID: string) => {
    const newSubTaskList = [...subTaskList];

    const subTaskIndex = newSubTaskList.findIndex((subT) => subT._id === ID);

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
    const index = subTaskList.findIndex((subT) => subT._id === ID);

    if (index === -1) return;

    const updatedSubTaskList = [
      ...subTaskList.slice(0, index),
      ...subTaskList.slice(index + 1),
    ];

    setSubTaskList(updatedSubTaskList);
  };

  const handleSubmit = () => {
    const taskTagsIds = taskTags.map((tag) => (!!tag._id ? tag._id : ""));

    console.log(selectedListItem);

    const updatedTask: TaskTypeResponse = {
      title: title,
      completed: (task && task.completed) || false,
      description: description,

      selectedListItem: selectedListItem,

      dueDate: dueDate,
      tags: taskTagsIds,
      subTasks: subTaskList,
    };

    handleEdit(task?._id || "", updatedTask);
    closeModal();
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedListItem("");
      setCurrListItem(undefined);
    } else {
      const currList = list.find((listItem) => listItem.name === selectedValue);
      console.log(currList);

      if (currList) {
        setSelectedListItem(currList._id || "");
        // setSelectedListItem({ _id: currList._id, name: currList.name });

        setCurrListItem(currList);
      }
    }
  };

  const handleAddTags = (ID: string) => {
    if (taskTags.length === tags.length) return;

    const tg = tags.find((t) => t._id === ID);
    if (!tg) return;

    setTaskTags([...taskTags, tg]);
  };

  const handleDeleteTaskTags = (ID: string) => {
    const index = taskTags.findIndex((t) => t._id === ID);

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
            value={currListItem?.name}
            onChange={handleListChange}
          >
            <option value="">Select an option</option>
            {list &&
              list.map((listItem, i) => {
                return (
                  <option key={i} value={listItem.name}>
                    {listItem.name}
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
                  key={tag._id}
                  className="inline-flex flex-wrap gap-2 p-2 bg-amber-300 mr-2"
                >
                  <p>{tag.name}</p>
                  <button onClick={() => handleDeleteTaskTags(tag._id || "")}>
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
                  onClick={() => handleAddTags(tag._id || "")}
                  className="py-2 bg-lime-300 min-w-[70px]"
                  key={tag._id}
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
                    onChange={() => handleSubTaskToggle(subTask._id || "")}
                  />
                  <p>{subTask.title}</p>
                </div>
                <button onClick={() => handleSubTaskDelete(subTask._id || "")}>
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
