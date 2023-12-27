import type { ComponentPropsWithoutRef } from "react";
import type { TBadgeProps } from "./types";
import classes from "./styles.module.scss";

const Badge: React.FC<ComponentPropsWithoutRef<"div"> & TBadgeProps> = ({
  id = "",
  name,
  onRemove,
  className = "",
  ...props
}) => {
  return (
    <div className={`${classes.wrapper} ${className}`} {...props}>
      <span>{name}</span>
      <button onClick={onRemove}>&times;</button>
    </div>
  );
};

export default Badge;
