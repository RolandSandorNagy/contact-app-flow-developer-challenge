import type { Contact } from "../../../types/contact";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ContactListItem } from "../ContactListItem/ContactListItem";
import styles from "./ContactList.module.css";

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onRemove: (contactId: number) => void;
}

export function ContactList({ contacts, onEdit, onRemove }: ContactListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (contacts.length === 0) {
    return <p className={styles.empty}>No contacts yet. Add your first contact.</p>;
  }

  return (
    <motion.ul className={styles.list} layout>
      <AnimatePresence initial={false}>
        {contacts.map((contact) => (
          <motion.li
            key={contact.id}
            className={styles.listItem}
            layout
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
          >
            <ContactListItem
              contact={contact}
              onEdit={() => onEdit(contact)}
              onRemove={() => onRemove(contact.id)}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
