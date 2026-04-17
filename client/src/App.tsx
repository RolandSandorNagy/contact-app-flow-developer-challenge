import { useCallback, useEffect, useState } from "react";
import { ContactList } from "./components/contacts/ContactList/ContactList";
import { Button } from "./components/ui/Button/Button";
import { IconButton } from "./components/ui/IconButton/IconButton";
import { ContactModal } from "./components/contacts/ContactModal/ContactModal";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from "./services/contactsApi";
import type { Contact } from "./types/contact";
import type { ContactPayload } from "./types/contact";
import styles from "./App.module.css";

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getContacts();
      setContacts(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load contacts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const openAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async (payload: ContactPayload) => {
    try {
      setIsSaving(true);
      setError(null);

      if (editingContact) {
        const updatedContact = await updateContact(editingContact.id, payload);
        setContacts((previousContacts) =>
          previousContacts.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact
          )
        );
      } else {
        const createdContact = await createContact(payload);
        setContacts((previousContacts) => [...previousContacts, createdContact]);
      }

      setIsModalOpen(false);
      setEditingContact(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save contact.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (contactId: number) => {
    try {
      setError(null);
      await deleteContact(contactId);
      setContacts((previousContacts) =>
        previousContacts.filter((contact) => contact.id !== contactId)
      );
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove contact.");
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.backIcon} aria-hidden="true">
            <span className={styles.backIconGlyph}>{"<"}</span>
          </span>
          <h1 className={styles.title}>Contacts</h1>
        </div>

        <div className={styles.topRight}>
          <IconButton className={styles.chromeButton} aria-hidden="true" tabIndex={-1}>
            <span className={styles.chromeGlyphSquare} />
          </IconButton>
          <IconButton className={styles.chromeButton} aria-hidden="true" tabIndex={-1}>
            <span className={styles.chromeGlyphLines} />
          </IconButton>

          <Button className={styles.addButton} onClick={openAddModal}>
            Add new
          </Button>
        </div>
      </header>

      {error ? <p className={styles.error}>{error}</p> : null}

      <main className={styles.content}>
        {isLoading ? (
          <p className={styles.status}>Loading contacts...</p>
        ) : (
          <ContactList contacts={contacts} onEdit={openEditModal} onRemove={handleRemove} />
        )}
      </main>

      <ContactModal
        isOpen={isModalOpen}
        mode={editingContact ? "edit" : "add"}
        contact={editingContact}
        isSubmitting={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
