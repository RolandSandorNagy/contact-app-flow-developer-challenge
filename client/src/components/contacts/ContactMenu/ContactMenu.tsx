import { useEffect, useRef, useState } from "react";
import { IconButton } from "../../ui/IconButton/IconButton";
import moreIcon from "../../../assets/icons/More.svg";
import editIcon from "../../../assets/icons/Change.svg";
import favouriteIcon from "../../../assets/icons/Favourite.svg";
import removeIcon from "../../../assets/icons/Delete.svg";
import muteIcon from "../../../assets/icons/Mute.svg";
import callIcon from "../../../assets/icons/Call.svg";
import styles from "./ContactMenu.module.css";

interface ContactMenuProps {
  onEdit: () => void;
  onRemove: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export function ContactMenu({ onEdit, onRemove, onOpenChange }: ContactMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

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
        aria-haspopup="true"
        className={styles.trigger}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <img src={moreIcon} alt="" className={styles.moreIcon} />
      </IconButton>

      {isOpen ? (
        <div className={styles.dropdown}>
          <button type="button" className={`${styles.item} ${styles.mobileOnlyItem}`} disabled>
            <img src={muteIcon} alt="" className={styles.itemIcon} />
            <span>Mute</span>
          </button>
          <button type="button" className={`${styles.item} ${styles.mobileOnlyItem}`} disabled>
            <img src={callIcon} alt="" className={styles.itemIcon} />
            <span>Call</span>
          </button>

          <button type="button" className={styles.item} onClick={handleEdit}>
            <img src={editIcon} alt="" className={styles.itemIcon} />
            <span>Edit</span>
          </button>
          <button type="button" className={styles.item} disabled>
            <img src={favouriteIcon} alt="" className={styles.itemIcon} />
            <span>Favourite</span>
          </button>
          <button
            type="button"
            className={`${styles.item} ${styles.remove}`}
            onClick={handleRemove}
          >
            <img src={removeIcon} alt="" className={styles.itemIcon} />
            <span>Remove</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
