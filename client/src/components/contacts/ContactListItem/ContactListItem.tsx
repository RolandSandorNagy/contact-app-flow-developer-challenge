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

export function ContactListItem({ contact, onEdit, onRemove }: ContactListItemProps) {
  const avatarSource = contact.avatar ?? defaultAvatarImage;

  return (
    <li className={styles.item}>
      <div className={styles.avatar}>
        <img src={avatarSource} alt={`${contact.name} avatar`} className={styles.avatarImage} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{contact.name}</h3>
        <p className={styles.phone}>{contact.phone || "No phone number"}</p>
      </div>

      <div className={styles.actions}>
        <span className={styles.actionIcon} aria-hidden="true">
          <img src={muteIcon} alt="" className={styles.actionIconImage} />
        </span>
        <span className={styles.actionIcon} aria-hidden="true">
          <img src={callIcon} alt="" className={styles.actionIconImage} />
        </span>
        <ContactMenu onEdit={onEdit} onRemove={onRemove} />
      </div>
    </li>
  );
}
