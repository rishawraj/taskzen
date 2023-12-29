import { ReactNode } from "react";

interface ModalPropType {
  isOpen: boolean;
  children?: ReactNode;
}

const Modal = ({ isOpen, children }: ModalPropType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bg-black/25 inset-0 flex items-center justify-center">
      <div className="absolute bg-accent p-4 rounded shadow-lg">{children}</div>
    </div>
  );
};

export default Modal;
