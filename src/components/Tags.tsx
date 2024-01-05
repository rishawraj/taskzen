import { useEffect, useState } from "react";
import Modal from "./Modal";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const localTags = getLocalStorageItem<TagType[]>("tags") || [];
    setTags(localTags);
  }, []);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleAddTag = () => {
    openModal();
  };

  const handleTagDelete = (index: number) => {
    const newTags = [...tags];
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

    // if (tags.some((tag) => tag === trimmedTagName)) {
    //   return;
    // }

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
    setLocalStorageItem("tags", []);
    setTags([]);
  };

  return (
    <>
      <h1 className="font-bold">Tags:</h1>

      <div className="inline-flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <button key={tag.id} className="flex bg-amber-1000 p-2 gap-2">
            <p>{tag.name} </p>
          </button>
        ))}
        <button className="flex p-2" onClick={handleAddTag}>
          {plusIcon} Create Tags
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="bg-accent ">
          <div className="flex justify-between p-2">
            <h1 className="bg-red-5000">Create Tags:</h1>

            <button onClick={closeModal}>{crossIcon}</button>
          </div>
          <div className="inline-flex gap-2 flex-wrap">
            {tags.map((tag, index) => (
              <span key={index} className="flex bg-amber-1000 p-2 gap-2">
                <p>{tag.name}</p>
                <button onClick={() => handleTagDelete(index)}>
                  {crossIcon}
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex bg-background rounded">
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
      </Modal>
    </>
  );
}

export default Tags;
