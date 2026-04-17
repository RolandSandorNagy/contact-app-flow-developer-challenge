import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "../../ui/Button/Button";
import styles from "./AvatarPicker.module.css";

interface AvatarPickerProps {
  avatar: string | null;
  name: string;
  disabled?: boolean;
  allowRemove?: boolean;
  onChange: (nextAvatar: string | null) => void;
}

function getInitials(name: string) {
  if (!name.trim()) {
    return "??";
  }

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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
  name,
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
        {avatar ? (
          <img className={styles.image} src={avatar} alt={name ? `${name} avatar` : "Avatar preview"} />
        ) : (
          <span>{getInitials(name)}</span>
        )}
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
        <Button variant="secondary" type="button" onClick={handlePickClick} disabled={disabled}>
          {avatar ? "Change picture" : "Upload picture"}
        </Button>
        {allowRemove && avatar ? (
          <Button type="button" variant="ghost" onClick={() => onChange(null)} disabled={disabled}>
            Remove
          </Button>
        ) : null}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
