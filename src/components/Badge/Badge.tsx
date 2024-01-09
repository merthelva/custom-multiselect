import { useCallback, type ComponentPropsWithoutRef } from "react";
import type { TBadgeProps } from "./types";
import classes from "./styles.module.scss";
import { TReactMouseEvent } from "components/Select";

const Badge: React.FC<ComponentPropsWithoutRef<"div"> & TBadgeProps> = ({
  id,
  name,
  onRemove,
  className = "",
  ...props
}) => {
  const handleDismiss = useCallback(
    (e: TReactMouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove();
    },
    []
  );

  return (
    <div className={`${classes.wrapper} ${className}`} {...props}>
      <span>{name}</span>
      <button id={`badge-dismiss-${id}`} onClick={handleDismiss}>
        &times;
      </button>
    </div>
  );
};

export default Badge;
