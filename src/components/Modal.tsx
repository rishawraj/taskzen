import { ReactNode } from "react";

interface ModalPropType {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalPropType) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute bg-accent p-4 rounded shadow-lg">{children}</div>
    </div>
  );
};

export default Modal;
