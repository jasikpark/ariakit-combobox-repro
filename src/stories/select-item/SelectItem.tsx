import {
  SelectItem as AriakitSelectItem,
  type SelectItemProps,
} from "@ariakit/react/select";
import cn from "classnames";
import { forwardRef } from "react";
import { useSelect } from "../SelectContext";
import styles from "./SelectItem.module.css";

type Props = {
  children: React.ReactNode;
  /** Item is a static message, not selectable */
  isMessage?: boolean;
  className?: string;
} & SelectItemProps;

export const SelectItem = forwardRef<HTMLDivElement, Props>(
  ({ children, isMessage, className, ...props }, ref) => {
    const { store: select } = useSelect();
    const value = select.useState("value");
    const isSelected = value === props.value;

    return (
      <AriakitSelectItem
        className={cn(styles.SelectItem, {
          [styles.SelectItem___isSelected]: isSelected,
          [styles.SelectItem___isMessage]: isMessage,
        })}
        disabled={isMessage}
        ref={ref}
        {...props}
      >
        {/* mr-16 balances out the padding difference between left and right, to properly center. */}
        <span className={cn("truncate grow mr-16", className)}>{children}</span>
      </AriakitSelectItem>
    );
  }
);
SelectItem.displayName = "SelectItem";
