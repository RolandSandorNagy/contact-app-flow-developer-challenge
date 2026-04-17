import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ className = "", children, ...props }: IconButtonProps) {
  const resolvedClassName = [styles.button, className].join(" ").trim();
  return (
    <button type="button" className={resolvedClassName} {...props}>
      {children}
    </button>
  );
}

