import { ReactNode, RefObject, useEffect, useRef } from "react";

interface ModalPropType {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
  fullScreen?: boolean;
}

const Modal = ({
  isOpen,
  children,
  onClose,
  fullScreen = true,
}: ModalPropType) => {
  const modalContentRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOuside = (e: MouseEvent) => {
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

  return fullScreen ? (
    <div className="fixed bg-black/25 inset-0 flex items-center justify-center">
      <div className="w-2/3 md:w-1/3 bg-red-500" ref={modalContentRef}>
        {children}
      </div>
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default Modal;
