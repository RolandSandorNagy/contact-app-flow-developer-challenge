import { useEffect, useRef, useState } from "react";
import { IconButton } from "../../ui/IconButton/IconButton";
import styles from "./ContactMenu.module.css";

interface ContactMenuProps {
  onEdit: () => void;
  onRemove: () => void;
}

export function ContactMenu({ onEdit, onRemove }: ContactMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleRemove = () => {
    onRemove();
    setIsOpen(false);
  };

  return (
    <div className={styles.menu} ref={menuRef}>
      <IconButton
        aria-label="Contact actions"
        aria-expanded={isOpen}
        className={styles.trigger}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className={styles.dotIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </IconButton>

      {isOpen ? (
        <div className={styles.dropdown} role="menu">
          <button type="button" className={styles.item} role="menuitem" onClick={handleEdit}>
            Edit
          </button>
          <button
            type="button"
            className={`${styles.item} ${styles.remove}`}
            role="menuitem"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
