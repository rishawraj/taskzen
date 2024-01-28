import { ReactNode, RefObject, useEffect, useRef } from "react";

interface ModalPropType {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
  fullScreen?: boolean;
  closeOnOutsideClick?: boolean;
}

const Modal = ({
  isOpen,
  children,
  onClose,
  fullScreen = true,
  closeOnOutsideClick = false,
}: ModalPropType) => {
  const modalContentRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOuside = (e: MouseEvent) => {
      if (
        closeOnOutsideClick &&
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

  // useEffect(() => {}, []);

  if (!isOpen) return null;

  return fullScreen ? (
    <div className="fixed top-0 bg-black/25 inset-0 flex items-center justify-center">
      <div className="bg-transparent" ref={modalContentRef}>
        {children}
      </div>
    </div>
  ) : (
    <div ref={modalContentRef}>{children}</div>
  );
};

export default Modal;
