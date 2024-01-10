import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";
import { crossIcon, plusIcon } from "../assets/icons";
import { v4 as uuidv4 } from "uuid";

interface TagType {
  id: string;
  name: string;
}

function Tags() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const localTags = getLocalStorageItem<TagType[]>("tags") || [];
    setTags(localTags);
  }, []);

  const handleTagDelete = (ID: string) => {
    const newTags = [...tags];
    const index = newTags.findIndex((t) => t.id === ID);

    newTags.splice(index, 1);
    setTags(newTags);
    setLocalStorageItem("tags", newTags);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      id: uuidv4(),
      name: trimmedTagName,
    };

    const newTags = [...tags, newTag];
    setTags(newTags);
    setNewTagName("");
    setLocalStorageItem("tags", newTags);
  };

  const handleClearAll = () => {
    setTags([]);
    setLocalStorageItem("tags", []);

    // clear applied tags
    setLocalStorageItem("appliedTags", []);
  };

  return (
    <>
      <div className="inline-flex gap-2 flex-wrap">
        {tags &&
          tags.map((tag, index) => (
            <span key={index} className="flex bg-amber-1000 p-2 gap-2">
              <p>{tag.name}</p>
              <button onClick={() => handleTagDelete(tag.id)}>
                {crossIcon}
              </button>
            </span>
          ))}
      </div>

      <div className="">
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

        <button onClick={handleClearAll} className="bg-secondary p-2">
          clear all
        </button>
      </div>
    </>
  );
}

export default Tags;
