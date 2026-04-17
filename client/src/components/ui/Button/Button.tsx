import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonType = "primary" | "secondary";
type ButtonVariant = "label" | "labelIcon" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType;
  variant?: ButtonVariant;
}

function toClassSuffix(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function Button({
  buttonType = "secondary",
  variant = "label",
  className = "",
  ...props
}: ButtonProps) {
  const typeClassName = styles[`type${toClassSuffix(buttonType)}`];
  const variantClassName = styles[`variant${toClassSuffix(variant)}`];
  const resolvedClassName = [styles.button, typeClassName, variantClassName, className]
    .join(" ")
    .trim();

  return <button className={resolvedClassName} {...props} />;
}
