import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

const DROPDOWN_WIDTH = 219;
const VIEWPORT_GUTTER = 8;

export function ContactMenu({ onEdit, onRemove, onOpenChange }: ContactMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownSide, setDropdownSide] = useState<"left" | "right">("left");
  const menuRef = useRef<HTMLDivElement>(null);

  const updateDropdownSide = useCallback(() => {
    const triggerRect = menuRef.current?.getBoundingClientRect();
    if (!triggerRect) {
      return;
    }

    const fitsToRight = triggerRect.left + DROPDOWN_WIDTH + VIEWPORT_GUTTER <= window.innerWidth;
    setDropdownSide(fitsToRight ? "left" : "right");
  }, []);

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

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updateDropdownSide();
  }, [isOpen, updateDropdownSide]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => updateDropdownSide();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, updateDropdownSide]);

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
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={toggleMenu}
      >
        <img src={moreIcon} alt="" width="15" height="15" className={styles.moreIcon} />
      </IconButton>

      {isOpen ? (
        <div
          className={`${styles.dropdown} ${
            dropdownSide === "left" ? styles.dropdownLeft : styles.dropdownRight
          }`}
        >
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
