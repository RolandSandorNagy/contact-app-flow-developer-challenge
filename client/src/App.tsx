import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { ContactList } from "./components/contacts/ContactList/ContactList";
import { Button } from "./components/ui/Button/Button";
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
import headerProfileImage from "./assets/images/JacquelineHeader.webp";
import styles from "./App.module.css";

const THEME_STORAGE_KEY = "contact-app-theme";
const ContactModal = lazy(() =>
  import("./components/contacts/ContactModal/ContactModal").then((module) => ({
    default: module.ContactModal
  }))
);

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const isLightMode = theme === "light";

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getContacts();
      setContacts(response);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Failed to load contacts."));
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
      setError(getErrorMessage(submitError, "Unable to save contact."));
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
      setError(getErrorMessage(removeError, "Unable to remove contact."));
    }
  };

  const toggleTheme = () => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  };

  const themeButtonLabel = isLightMode ? "Switch to dark mode" : "Switch to light mode";

  return (
    <div className={`${styles.app} ${isLightMode ? styles.themeLight : ""}`.trim()}>
      <header className={styles.topBar}>
        <div className={styles.headerLeftCell}>
          <span className={styles.backIcon} aria-hidden="true">
            <img
              src={backArrowIcon}
              alt=""
              width="16"
              height="16"
              className={`${styles.headerIconImage} ${styles.backIconImage}`}
            />
          </span>
        </div>

        <div className={styles.headerCenterCell}>
          <span className={styles.mobileBackIcon} aria-hidden="true">
            <img
              src={backArrowIcon}
              alt=""
              width="16"
              height="16"
              className={`${styles.headerIconImage} ${styles.backIconImage}`}
            />
          </span>

          <h1 className={styles.title}>Contacts</h1>

          <div className={styles.headerControlsBox}>
            <div className={styles.headerControlsBoxIcons}>
              <span className={styles.headerIcon} aria-hidden="true">
                <img
                  src={settingsIcon}
                  alt=""
                  width="19"
                  height="19"
                  className={`${styles.headerIconImage} ${styles.settingsIconImage}`}
                />
              </span>
              <span className={styles.headerAvatar} aria-hidden="true">
                <img
                  src={headerProfileImage}
                  alt=""
                  width="24"
                  height="24"
                  decoding="async"
                  className={styles.headerAvatarImage}
                />
              </span>
              <button
                type="button"
                className={`${styles.headerIcon} ${styles.mobileOnlyLightIcon} ${styles.lightModeButton}`}
                onClick={toggleTheme}
                aria-label={themeButtonLabel}
                aria-pressed={isLightMode}
              >
                <img
                  src={lightModeIcon}
                  alt=""
                  width="22"
                  height="22"
                  className={`${styles.headerIconImage} ${styles.lightModeIconImage}`}
                />
              </button>
            </div>

            <Button
              className={styles.addButton}
              buttonType="special"
              variant="labelIcon"
              onClick={openAddModal}
              aria-label="Add new contact"
            >
              <span className={styles.addPlus} aria-hidden="true">
                <img src={addIcon} alt="" width="24" height="24" className={styles.addPlusIcon} />
              </span>
              <span className={styles.addButtonLabel}>Add new</span>
            </Button>
          </div>
        </div>

        <div className={styles.headerRightCell}>
          <button
            type="button"
            className={`${styles.headerIcon} ${styles.lightModeButton}`}
            onClick={toggleTheme}
            aria-label={themeButtonLabel}
            aria-pressed={isLightMode}
          >
            <img
              src={lightModeIcon}
              alt=""
              width="22"
              height="22"
              className={`${styles.headerIconImage} ${styles.lightModeIconImage}`}
            />
          </button>
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

      {isModalOpen ? (
        <Suspense fallback={null}>
          <ContactModal
            isOpen={isModalOpen}
            mode={editingContact ? "edit" : "add"}
            contact={editingContact}
            isSubmitting={isSaving}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
