import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "../../ui/Button/Button";
import { IconButton } from "../../ui/IconButton/IconButton";
import defaultAvatarImage from "../../../assets/images/Default.png";
import changeIcon from "../../../assets/icons/Change.svg";
import deleteIcon from "../../../assets/icons/Delete.svg";
import styles from "./AvatarPicker.module.css";

interface AvatarPickerProps {
  avatar: string | null;
  disabled?: boolean;
  allowRemove?: boolean;
  onChange: (nextAvatar: string | null) => void;
}

function readImageAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not read image."));
    };
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export function AvatarPicker({
  avatar,
  disabled = false,
  allowRemove = false,
  onChange
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePickClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setError(null);
      const base64 = await readImageAsBase64(file);
      onChange(base64);
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Unable to read image.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>
        <img className={styles.image} src={avatar ?? defaultAvatarImage} alt="Avatar preview" />
      </div>

      <div className={styles.actions}>
        <input
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
        />
        <Button
          className={styles.changeButton}
          buttonType="secondary"
          variant="labelIcon"
          type="button"
          onClick={handlePickClick}
          disabled={disabled}
        >
          <span className={styles.changeButtonContent}>
            <img src={changeIcon} alt="" className={styles.changeIcon} />
            <span>{avatar ? "Change picture" : "Upload picture"}</span>
          </span>
        </Button>
        {allowRemove && avatar ? (
          <IconButton
            className={styles.removeButton}
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            aria-label="Remove picture"
          >
            <img src={deleteIcon} alt="" className={styles.removeIcon} />
          </IconButton>
        ) : null}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
