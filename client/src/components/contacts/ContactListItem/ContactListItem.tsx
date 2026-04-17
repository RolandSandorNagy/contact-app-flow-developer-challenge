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
        <img src={avatarSource} alt={`${contact.name} avatar`} className={styles.avatarImage} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{contact.name}</h3>
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
          <img src={muteIcon} alt="" className={styles.actionIconImage} />
        </span>
        <span className={styles.actionIcon} aria-hidden="true">
          <img src={callIcon} alt="" className={styles.actionIconImage} />
        </span>
        <ContactMenu onEdit={onEdit} onRemove={onRemove} onOpenChange={setIsMenuOpen} />
      </div>
    </li>
  );
}
