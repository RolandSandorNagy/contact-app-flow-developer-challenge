import type { Contact } from "../../../types/contact";
import { ContactListItem } from "../ContactListItem/ContactListItem";
import styles from "./ContactList.module.css";

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onRemove: (contactId: number) => void;
}

export function ContactList({ contacts, onEdit, onRemove }: ContactListProps) {
  if (contacts.length === 0) {
    return <p className={styles.empty}>No contacts yet. Add your first contact.</p>;
  }

  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <ContactListItem
          key={contact.id}
          contact={contact}
          onEdit={() => onEdit(contact)}
          onRemove={() => onRemove(contact.id)}
        />
      ))}
    </ul>
  );
}
