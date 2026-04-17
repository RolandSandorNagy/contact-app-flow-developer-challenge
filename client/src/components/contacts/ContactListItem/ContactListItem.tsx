import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Contact } from "../../../types/contact";
import { ContactMenu } from "../ContactMenu/ContactMenu";
import defaultAvatarImage from "../../../assets/images/Default.png";
import muteIcon from "../../../assets/icons/Mute.svg";
import callIcon from "../../../assets/icons/Call.svg";
import styles from "./ContactListItem.module.css";

interface ContactListItemProps {
  contact: Contact;
  onEdit: () => void;
  onRemove: () => void;
}

function createTelHref(phone: string) {
  const trimmedPhone = phone.trim();
  const hasLeadingPlus = trimmedPhone.startsWith("+");
  const digits = trimmedPhone.replace(/\D/g, "");

  if (!digits) {
    return `tel:${trimmedPhone}`;
  }

  return `tel:${hasLeadingPlus ? `+${digits}` : digits}`;
}

const MOBILE_QUERY = "(max-width: 640px)";

export function ContactListItem({ contact, onEdit, onRemove }: ContactListItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const avatarSource = contact.avatar ?? defaultAvatarImage;
  const telHref = contact.phone ? createTelHref(contact.phone) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(MOBILE_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (event.matches) {
        setIsHovered(false);
      }
    };

    setIsMobile(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  const shouldShowActions = isMobile || isHovered || isMenuOpen;
  const itemClassName = `${styles.item}${isMenuOpen ? ` ${styles.itemMenuOpen}` : ""}`;

  const actionsAnimation = shouldShowActions
    ? { opacity: 1, x: 0 }
    : { opacity: 0, x: 2 };

  return (
    <motion.div
      className={itemClassName}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onFocusCapture={() => !isMobile && setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!isMobile && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsHovered(false);
        }
      }}
      initial={false}
    >
      <div className={styles.avatar}>
        <img
          src={avatarSource}
          alt={`${contact.name} avatar`}
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
          className={styles.avatarImage}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{contact.name}</p>
        <p className={styles.phone}>
          {contact.phone && telHref ? (
            <a href={telHref} className={styles.phoneLink}>
              {contact.phone}
            </a>
          ) : (
            "No phone number"
          )}
        </p>
      </div>

      <motion.div
        className={styles.actions}
        initial={false}
        animate={actionsAnimation}
        transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
        style={{ pointerEvents: shouldShowActions ? "auto" : "none" }}
      >
        <motion.span
          className={styles.actionIcon}
          aria-hidden="true"
          initial={false}
          animate={actionsAnimation}
          transition={{ duration: shouldReduceMotion ? 0 : 0.14, delay: shouldShowActions ? 0 : 0 }}
        >
          <img src={muteIcon} alt="" width="16" height="16" className={styles.actionIconImage} />
        </motion.span>
        <motion.span
          className={styles.actionIcon}
          aria-hidden="true"
          initial={false}
          animate={actionsAnimation}
          transition={{ duration: shouldReduceMotion ? 0 : 0.14, delay: shouldShowActions ? 0.03 : 0 }}
        >
          <img src={callIcon} alt="" width="16" height="16" className={styles.actionIconImage} />
        </motion.span>
        <motion.div
          initial={false}
          animate={actionsAnimation}
          transition={{ duration: shouldReduceMotion ? 0 : 0.14, delay: shouldShowActions ? 0.06 : 0 }}
        >
          <ContactMenu onEdit={onEdit} onRemove={onRemove} onOpenChange={setIsMenuOpen} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
