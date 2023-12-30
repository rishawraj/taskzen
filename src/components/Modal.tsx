import { ReactNode, RefObject, useEffect, useRef } from "react";

interface ModalPropType {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, children, onClose }: ModalPropType) => {
  const modalContentRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOuside = (e: MouseEvent) => {
      console.log("handle click outside!");
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOuside);

      return () => {
        document.removeEventListener("mousedown", handleClickOuside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bg-black/25 inset-0 flex items-center justify-center">
      <div
        ref={modalContentRef}
        className="absolute bg-accent p-4 rounded shadow-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
