import { useCallback, type ComponentPropsWithoutRef } from "react";
import type { TBadgeProps } from "./types";
import classes from "./styles.module.scss";

const Badge: React.FC<ComponentPropsWithoutRef<"div"> & TBadgeProps> = ({
  id = "",
  name,
  onRemove,
  className = "",
  ...props
}) => {
  const handleDismiss = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onRemove();
    },
    []
  );

  return (
    <div className={`${classes.wrapper} ${className}`} {...props}>
      <span>{name}</span>
      <button onClick={handleDismiss}>&times;</button>
    </div>
  );
};

export default Badge;
