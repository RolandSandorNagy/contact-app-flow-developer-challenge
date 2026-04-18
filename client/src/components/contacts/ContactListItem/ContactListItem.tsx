import { useState } from "react";
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

export function ContactListItem({ contact, onEdit, onRemove }: ContactListItemProps) {
  const avatarSource = contact.avatar ?? defaultAvatarImage;
  const telHref = contact.phone ? createTelHref(contact.phone) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemClassName = `${styles.item}${isMenuOpen ? ` ${styles.itemMenuOpen}` : ""}`;

  return (
    <li className={itemClassName}>
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

      <div className={styles.actions}>
        <span className={styles.actionIcon} aria-hidden="true">
          <img src={muteIcon} alt="" width="16" height="16" className={styles.actionIconImage} />
        </span>
        <span className={styles.actionIcon} aria-hidden="true">
          <img src={callIcon} alt="" width="16" height="16" className={styles.actionIconImage} />
        </span>
        <ContactMenu onEdit={onEdit} onRemove={onRemove} onOpenChange={setIsMenuOpen} />
      </div>
    </li>
  );
}
