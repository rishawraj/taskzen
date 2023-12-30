import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorage";

function Tags() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const localTags = getLocalStorageItem<string[]>("tags") || [];
    setTags(localTags);
  }, []);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleAddTag = () => {
    console.log("hi");
    openModal();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTags = [...tags, newTag];
    setTags(newTags);
    setNewTag("");
    setLocalStorageItem("tags", newTags);
  };

  return (
    <>
      <h1 className="font-bold">Tags:</h1>
      {tags.map((tag, index) => (
        <p key={index}>{tag}</p>
      ))}

      <button onClick={handleAddTag}>+ add</button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <h1 className="bg-red-500">Add Tags:</h1>
        <form onSubmit={handleSubmit}>
          <button>+</button>

          <input
            type="text"
            name="add-tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
        </form>
      </Modal>
    </>
  );
}

export default Tags;
