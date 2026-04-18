import { useEffect, useId, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const headingId = useId();
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
  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.035,
            delayChildren: 0.03
          }
        }
      };
  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 }
      };
  const itemTransition = { duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" } as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disableClose={isSubmitting}
      showCloseButton={false}
      ariaLabelledBy={headingId}
    >
      <motion.form
        className={styles.form}
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
      >
        <div className={styles.contactBlock}>
          <motion.h2
            id={headingId}
            className={styles.title}
            variants={itemVariants}
            transition={itemTransition}
          >
            {title}
          </motion.h2>

          <motion.div
            className={`${styles.section} ${styles.avatarSection}`}
            variants={itemVariants}
            transition={itemTransition}
          >
            <AvatarPicker avatar={avatar} disabled={isSubmitting} allowRemove onChange={setAvatar} />
          </motion.div>

          <motion.div className={styles.section} variants={itemVariants} transition={itemTransition}>
            <Input
              label="Name"
              value={name}
              placeholder="Jamie Wright"
              className={styles.fieldInput}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSubmitting}
            />
            {nameError ? <p className={styles.error}>{nameError}</p> : null}
          </motion.div>

          <motion.div className={styles.section} variants={itemVariants} transition={itemTransition}>
            <Input
              label="Phone number"
              value={phone}
              placeholder="+01 234 5678"
              className={styles.fieldInput}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isSubmitting}
            />
          </motion.div>

          <motion.div className={styles.section} variants={itemVariants} transition={itemTransition}>
            <Input
              label="Email address"
              type="email"
              value={email}
              placeholder="jamie.wright@mail.com"
              className={styles.fieldInput}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </motion.div>
        </div>

        <motion.footer className={styles.footer} variants={itemVariants} transition={itemTransition}>
          <Button
            buttonType="secondary"
            variant="label"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className={styles.doneButton}
            buttonType="primary"
            variant="label"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Done"}
          </Button>
        </motion.footer>
      </motion.form>
    </Modal>
  );
}
