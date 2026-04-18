import { useRef, useState, type ChangeEvent } from "react";
import { Button } from "../../ui/Button/Button";
import defaultAvatarImage from "../../../assets/images/Default.png";
import addIcon from "../../../assets/icons/Add.svg";
import changeIcon from "../../../assets/icons/Change.svg";
import deleteIcon from "../../../assets/icons/Delete.svg";
import styles from "./AvatarPicker.module.css";

interface AvatarPickerProps {
  avatar: string | null;
  disabled?: boolean;
  allowRemove?: boolean;
  onChange: (nextAvatar: string | null) => void;
}

const MAX_AVATAR_EDGE = 192;
const AVATAR_QUALITY = 0.82;

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

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not process image."));
    };
    reader.onerror = () => reject(new Error("Could not process image."));
    reader.readAsDataURL(blob);
  });
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not process image."));
    image.src = url;
  });
}

async function optimizeImageForStorage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImageFromUrl(objectUrl);
    const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = longestEdge > MAX_AVATAR_EDGE ? MAX_AVATAR_EDGE / longestEdge : 1;

    const targetWidth = Math.max(1, Math.round(image.naturalWidth * scale));
    const targetHeight = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not process image.");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", AVATAR_QUALITY);
    });

    if (!blob) {
      return readImageAsBase64(file);
    }

    return readBlobAsDataUrl(blob);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function AvatarPicker({
  avatar,
  disabled = false,
  allowRemove = false,
  onChange
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const hasAvatar = Boolean(avatar);
  const pickButtonLabel = avatar ? "Change picture" : "Add picture";
  const pickButtonIcon = hasAvatar ? changeIcon : addIcon;

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
      const base64 = await optimizeImageForStorage(file);
      onChange(base64);
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Unable to read image.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.previewButton}
        type="button"
        onClick={handlePickClick}
        disabled={disabled}
        aria-label={pickButtonLabel}
      >
        <span className={styles.preview}>
          <img
            className={styles.image}
            src={avatar ?? defaultAvatarImage}
            alt="Avatar preview"
            width="88"
            height="88"
            decoding="async"
          />
        </span>
      </button>

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
          buttonType="primary"
          variant="labelIcon"
          type="button"
          onClick={handlePickClick}
          disabled={disabled}
          aria-label={pickButtonLabel}
        >
          <span className={styles.changeButtonContent}>
            <img src={pickButtonIcon} alt="" className={styles.changeIcon} />
            <span className={styles.changeButtonLabel}>{pickButtonLabel}</span>
          </span>
        </Button>
        {allowRemove && avatar ? (
          <Button
            className={styles.removeButton}
            buttonType="primary"
            variant="icon"
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            aria-label="Remove picture"
          >
            <img src={deleteIcon} alt="" className={styles.removeIcon} />
          </Button>
        ) : null}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
