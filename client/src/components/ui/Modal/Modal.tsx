import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  disableClose?: boolean;
  showCloseButton?: boolean;
  ariaLabelledBy?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  disableClose = false,
  showCloseButton = true,
  ariaLabelledBy,
  children
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

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

  const handleOverlayClick = () => {
    if (!disableClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={styles.overlay}
          onClick={handleOverlayClick}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            onClick={(event) => event.stopPropagation()}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            {showCloseButton ? (
              <IconButton
                className={styles.closeButton}
                onClick={onClose}
                disabled={disableClose}
                aria-label="Close modal"
              >
                <span className={styles.closeIcon}>x</span>
              </IconButton>
            ) : null}
            <div className={styles.content}>{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
