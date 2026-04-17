import { useCallback, useEffect, useState } from "react";
import { ContactList } from "./components/contacts/ContactList/ContactList";
import { Button } from "./components/ui/Button/Button";
import { ContactModal } from "./components/contacts/ContactModal/ContactModal";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from "./services/contactsApi";
import type { Contact } from "./types/contact";
import type { ContactPayload } from "./types/contact";
import addIcon from "./assets/icons/Add.svg";
import backArrowIcon from "./assets/icons/BackArrow.svg";
import lightModeIcon from "./assets/icons/LightMode.svg";
import settingsIcon from "./assets/icons/Settings.svg";
import headerProfileImage from "./assets/images/Jacqueline.png";
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
        <div className={styles.headerLeftCell}>
          <span className={styles.backIcon} aria-hidden="true">
            <img
              src={backArrowIcon}
              alt=""
              className={`${styles.headerIconImage} ${styles.backIconImage}`}
            />
          </span>
        </div>

        <div className={styles.headerCenterCell}>
          <h1 className={styles.title}>Contacts</h1>

          <div className={styles.headerControlsBox}>
            <div className={styles.headerControlsBoxIcons}>
              <span className={styles.headerIcon} aria-hidden="true">
                <img
                  src={settingsIcon}
                  alt=""
                  className={`${styles.headerIconImage} ${styles.settingsIconImage}`}
                />
              </span>
              <span className={styles.headerAvatar} aria-hidden="true">
                <img src={headerProfileImage} alt="" className={styles.headerAvatarImage} />
              </span>
            </div>

            <Button
              className={styles.addButton}
              buttonType="primary"
              variant="labelIcon"
              onClick={openAddModal}
            >
              <span className={styles.addPlus} aria-hidden="true">
                <img src={addIcon} alt="" className={styles.addPlusIcon} />
              </span>
              <span>Add new</span>
            </Button>
          </div>
        </div>

        <div className={styles.headerRightCell}>
          <span className={styles.headerIcon} aria-hidden="true">
            <img
              src={lightModeIcon}
              alt=""
              className={`${styles.headerIconImage} ${styles.lightModeIconImage}`}
            />
          </span>
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
