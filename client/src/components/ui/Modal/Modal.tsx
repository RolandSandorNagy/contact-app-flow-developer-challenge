import { useEffect, type ReactNode } from "react";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  disableClose?: boolean;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, disableClose = false, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen || disableClose) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    if (!disableClose) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <IconButton
            className={styles.closeButton}
            onClick={onClose}
            disabled={disableClose}
            aria-label="Close modal"
          >
            <span className={styles.closeIcon}>x</span>
          </IconButton>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
