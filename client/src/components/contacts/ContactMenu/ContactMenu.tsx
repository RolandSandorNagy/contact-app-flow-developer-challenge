import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "../../ui/IconButton/IconButton";
import moreIcon from "../../../assets/icons/More.svg";
import editIcon from "../../../assets/icons/Settings.svg";
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
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggleMenu = useCallback(() => {
    setIsOpen((previous) => {
      const next = !previous;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMenu]);

  const handleEdit = () => {
    onEdit();
    closeMenu();
  };

  const handleRemove = () => {
    onRemove();
    closeMenu();
  };

  return (
    <div className={styles.menu} ref={menuRef}>
      <IconButton
        aria-label="Contact actions"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={styles.trigger}
        onClick={toggleMenu}
      >
        <img src={moreIcon} alt="" width="15" height="15" className={styles.moreIcon} />
      </IconButton>

      {isOpen ? (
        <div className={styles.dropdown}>
          <button type="button" className={`${styles.item} ${styles.mobileOnlyItem}`} disabled>
            <img src={muteIcon} alt="" width="20" height="20" className={styles.itemIcon} />
            <span>Mute</span>
          </button>
          <button type="button" className={`${styles.item} ${styles.mobileOnlyItem}`} disabled>
            <img src={callIcon} alt="" width="20" height="20" className={styles.itemIcon} />
            <span>Call</span>
          </button>

          <button type="button" className={styles.item} onClick={handleEdit}>
            <img src={editIcon} alt="" width="20" height="20" className={styles.itemIcon} />
            <span>Edit</span>
          </button>
          <button type="button" className={styles.item} disabled>
            <img src={favouriteIcon} alt="" width="20" height="20" className={styles.itemIcon} />
            <span>Favourite</span>
          </button>
          <button
            type="button"
            className={`${styles.item} ${styles.remove}`}
            onClick={handleRemove}
          >
            <img src={removeIcon} alt="" width="20" height="20" className={styles.itemIcon} />
            <span>Remove</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
