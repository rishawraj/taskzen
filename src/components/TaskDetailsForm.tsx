import { useEffect, useState } from "react";
import { crossIcon, trashIcon } from "../assets/icons";
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
import { toast } from "react-toastify";

function TaskDetailsForm({
  index,
  task,
  handleEdit,
  closeModal,
  handleDelete,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const [list, setList] = useState<ListResponse[]>([]);

  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );

  const [selectedListItem, setSelectedListItem] = useState(
    task?.selectedListItem
  );
  const [currListItem, setCurrListItem] = useState<ListResponse>();

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
        `/api/lists/${task?.selectedListItem._id}`
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

    if (!newSubTaskText) {
      toast.info("Subtask cannot be empty");
      return;
    }

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

  const handleSubTaskToggle = (ID: string, idx: number) => {
    if (ID === "") {
      const newSubTaskList = [...subTaskList];

      newSubTaskList[idx].completed = !newSubTaskList[idx].completed;

      const sortedTasks = [...newSubTaskList].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      });

      setSubTaskList(sortedTasks);
      return;
    }
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

  const handleSubTaskDelete = (ID: string, idx: number) => {
    if (ID === "") {
      const newSubTaskList = [...subTaskList];
      newSubTaskList.splice(idx, 1);
      setSubTaskList(newSubTaskList);
      return;
    }

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

      dueDate: dueDate,
      tags: taskTagsIds,
      subTasks: subTaskList,
    };

    if (selectedListItem) {
      updatedTask.selectedListItem = selectedListItem;
    }

    handleEdit(task?._id || "", updatedTask);
    closeModal();
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedListItem({ _id: "", name: currListItem?.name || "" });
      setCurrListItem(undefined);
    } else {
      const currList = list.find((listItem) => listItem.name === selectedValue);
      console.log(currList);

      if (currList) {
        setSelectedListItem(currList);

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
    <div className="text-text p-5 md:p-0 h-screen md:h-full md:max-h-screen xl:min-h-screen overflow-auto w-screen md:max-w-xl xl:w-full flex justify-center items-center bg-red-5000 max-h-full bg-red-3000 flex-1">
      <div className="p-10 flex-1 h-full w-full flex flex-col gap-4 bg-background rounded bg-red-6000 overflow-y-auto xl:min-h-[900px] xl:max-h-[900px] xl:border-2 border-dark">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold capitalize"> {task?.title}</h1>

          <button className="rounded-full p-2" onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32" // Increase width
              height="32" // Increase height
              viewBox="0 0 24 24"
              className="fill-text hover:fill-red-500"
            >
              <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 bg-red-3000 justify-between">
          <div className="flex flex-col gap-5">
            <input
              name="title"
              id="title"
              type="text"
              className="bg-accent focus:bg-background border-2 border-gray-300 p-3 rounded-md focus:outline-none focus:border-dark transition duration-300"
              placeholder={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* desc */}

            <textarea
              name="description"
              id="description"
              className="bg-accent focus:bg-background border-2 border-gray-300 p-3 rounded-md h-24 focus:outline-none focus:border-dark transition duration-300 resize-none"
              placeholder={description || "Enter description"}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* list */}

            <div className="flex items-center space-x-4">
              <label htmlFor="list" className="font-semibold text-text">
                List
              </label>
              <select
                id="list"
                name="list"
                value={currListItem?.name}
                onChange={handleListChange}
                className="w-40 bg-accent text-text border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-dark transition duration-300"
              >
                <option value="">Select an option</option>
                {list &&
                  list.map((listItem, i) => (
                    <option key={i} value={listItem.name}>
                      {listItem.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* date */}
            <div className="flex items-center space-x-4">
              <label htmlFor="dueDate" className="font-semibold  text-text">
                Due date
              </label>
              <input
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  setDueDate(selectedDate);
                }}
                value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                type="date"
                name="dueDate"
                id="dueDate"
                className="w-36 bg-accent text-text border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              />
            </div>

            {/* tags */}
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <label className="font-semibold  text-text mr-2">Tags</label>
                {taskTags &&
                  taskTags.map((tag) => (
                    <div
                      key={tag._id}
                      className="inline-flex items-center gap-2 p-2 bg-secondary rounded-md "
                    >
                      <p className="">{tag.name}</p>
                      <button
                        onClick={() => handleDeleteTaskTags(tag._id || "")}
                        className=""
                      >
                        {crossIcon}
                      </button>
                    </div>
                  ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {tagListOpen &&
                  tags &&
                  tags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => handleAddTags(tag._id || "")}
                      className="py-2 px-4 bg-primary rounded-md"
                    >
                      {tag.name}
                    </button>
                  ))}
                <button
                  onClick={() => setTagLisOpen(!tagListOpen)}
                  className="py-2 px-4 bg-fuchsia-300 rounded-md"
                >
                  + Add Tags
                </button>
              </div>
            </div>

            {/* subtask */}
            <h2 className="text-xl font-bold">Subtasks:</h2>
            <form
              onSubmit={handleSubTaskFormSubmit}
              className="flex border-2 rounded-xl bg-accent"
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
                className="p-2 w-full bg-accent focus:bg-background focus:outline-none text-text"
                type="text"
                placeholder="Add New Subtask"
                value={newSubTaskText}
                autoComplete="off"
                onChange={(e) => setNewSubTaskText(e.target.value)}
              />
            </form>

            <div className="md:max-h-32 md:overflow-y-auto xl:max-h-42 xl:overflow-y-auto flex gap-2 flex-col">
              {subTaskList &&
                subTaskList.map((subTask, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 border-text bg-primary rounded gap-2"
                  >
                    <div className="flex gap-4 ">
                      <input
                        id={i.toString()}
                        type="checkbox"
                        checked={subTask.completed}
                        onChange={() =>
                          handleSubTaskToggle(subTask._id || "", i)
                        }
                      />
                      <p>{subTask.title}</p>
                    </div>
                    <button
                      onClick={() => handleSubTaskDelete(subTask._id || "", i)}
                    >
                      {trashIcon}
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/*  */}
          <div className="bg-yellow-4000 flex flex-col xl:items-center gap-2 justify-between xl:flex-row-reverse">
            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-secondary p-2 my-2 font-semibold flex-1 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                handleDelete(task?._id || "");
                closeModal();
              }}
              className="bg-red-300 p-2 text-text font-semibold flex-1 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsForm;
