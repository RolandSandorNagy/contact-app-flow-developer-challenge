import type { Contact } from "../../../types/contact";
import { ContactMenu } from "../ContactMenu/ContactMenu";
import styles from "./ContactListItem.module.css";

interface ContactListItemProps {
  contact: Contact;
  onEdit: () => void;
  onRemove: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ContactListItem({ contact, onEdit, onRemove }: ContactListItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.avatar}>
        {contact.avatar ? (
          <img src={contact.avatar} alt={`${contact.name} avatar`} className={styles.avatarImage} />
        ) : (
          <span>{getInitials(contact.name)}</span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{contact.name}</h3>
        <p className={styles.phone}>{contact.phone || "No phone number"}</p>
      </div>

      <div className={styles.actions}>
        <ContactMenu onEdit={onEdit} onRemove={onRemove} />
      </div>
    </li>
  );
}
