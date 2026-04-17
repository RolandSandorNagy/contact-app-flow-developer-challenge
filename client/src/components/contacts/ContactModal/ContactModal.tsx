import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import { Modal } from "../../ui/Modal/Modal";
import type { Contact, ContactPayload } from "../../../types/contact";
import { AvatarPicker } from "../AvatarPicker/AvatarPicker";
import styles from "./ContactModal.module.css";

type ContactModalMode = "add" | "edit";

interface ContactModalProps {
  mode: ContactModalMode;
  isOpen: boolean;
  contact: Contact | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ContactPayload) => void | Promise<void>;
}

function normalizeOptionalValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function ContactModal({
  mode,
  isOpen,
  contact,
  isSubmitting,
  onClose,
  onSubmit
}: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(contact?.name ?? "");
    setPhone(contact?.phone ?? "");
    setEmail(contact?.email ?? "");
    setAvatar(contact?.avatar ?? null);
    setNameError(null);
  }, [isOpen, contact]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required.");
      return;
    }

    setNameError(null);
    await onSubmit({
      name: trimmedName,
      phone: normalizeOptionalValue(phone),
      email: normalizeOptionalValue(email),
      avatar
    });
  };

  const title = mode === "add" ? "Add contact" : "Edit contact";

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} disableClose={isSubmitting}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Image</p>
          <AvatarPicker
            name={name}
            avatar={avatar}
            disabled={isSubmitting}
            allowRemove={mode === "edit"}
            onChange={setAvatar}
          />
        </div>

        <div className={styles.section}>
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={isSubmitting}
          />
          {nameError ? <p className={styles.error}>{nameError}</p> : null}
        </div>

        <Input
          label="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={isSubmitting}
        />

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
        />

        <div className={styles.actions}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Done"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
