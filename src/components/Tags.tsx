import { useEffect, useState } from "react";
import {
  // getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";
import { crossIcon, plusIcon } from "../assets/icons";
// import { v4 as uuidv4 } from "uuid";
import { DeleteResponse, TagType } from "../types/types";
import { Methods, fetchWithAuth } from "../utils/fetchWithAuth";
import { toast } from "react-toastify";

function Tags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetchWithAuth<TagType[]>("/api/tags");
      setTags(response);
    };

    fetchTags();
  }, []);

  const handleTagDelete = async (ID: string) => {
    const backupTagList = [...tags];
    const newTags = [...tags];
    const index = newTags.findIndex((t) => t._id === ID);

    newTags.splice(index, 1);
    setTags(newTags);
    const response = await fetchWithAuth<DeleteResponse>(
      `/api/tags/${ID}`,
      Methods.DELETE
    );

    console.log(response);

    if (!response) {
      setTags(backupTagList);
      toast.error("Tag not deleted, Try again");
      return;
    }
    toast.success("Tag deleted");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTagName = newTagName.trim().toLowerCase();

    if (trimmedTagName === "") {
      return;
    }

    const index = tags.findIndex((t) => t.name === trimmedTagName);
    if (index !== -1) {
      return;
    }

    const newTag: TagType = {
      name: trimmedTagName,
    };

    const newTags = [...tags, newTag];
    setTags(newTags);
    setNewTagName("");

    const response = await fetchWithAuth<TagType[]>(
      "/api/tags",
      Methods.POST,
      newTag
    );

    if (!response) {
      const tagList = [...tags];
      tagList.pop();
      setTags(tagList);
      toast.error("Tag not added, Try again!");
    }
  };

  const handleClearAll = () => {
    const deleteAll = async () => {
      const backup = [...tags];
      setTags([]);

      const response = await fetchWithAuth("/api/tags", Methods.DELETE);
      console.log(response);
      if (!response) {
        setTags(backup);
        // toast.success("all tags deleted");
      }
    };

    deleteAll();

    // clear applied tags
    setLocalStorageItem("appliedTags", []);
  };

  return (
    <div className="bg-primary max-w-md p-4">
      <div className="inline-flex gap-2 flex-wrap ">
        {tags &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="flex bg-amber-1000 p-2 gap-2 bg-accent"
            >
              <p>{tag.name}</p>
              <button onClick={() => handleTagDelete(tag._id || "")}>
                {crossIcon}
              </button>
            </span>
          ))}
      </div>

      <div className="mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex bg-background rounded border-2 border-green-500"
        >
          <button>{plusIcon}</button>

          <input
            type="text"
            name="add-tag"
            className="bg-transparent outline-none"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </form>
      </div>
      <button onClick={handleClearAll} className="bg-secondary p-2 mt-4">
        clear all
      </button>
    </div>
  );
}

export default Tags;
