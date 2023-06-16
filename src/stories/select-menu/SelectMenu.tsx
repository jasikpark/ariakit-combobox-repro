import {
  ComboboxPopover,
  type ComboboxPopoverProps,
} from "@ariakit/react/combobox";
import { SelectPopover, type SelectPopoverProps } from "@ariakit/react/select";
import cn from "classnames";
import { Children } from "react";
import { ComboboxItem } from "../combobox/combobox-item/ComboboxItem";
import { SelectItem } from "../select-item/SelectItem";
import styles from "./SelectMenu.module.css";

type SelectMenuProps = {
  /** Message to show if no items are available to choose */
  noItemsMessage?: string;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  type: "select";
} & SelectPopoverProps;

type ComboboxMenuProps = {
  /** Message to show if no items are available to choose */
  noItemsMessage?: string;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  type: "combobox";
} & ComboboxPopoverProps;

type Props = SelectMenuProps | ComboboxMenuProps;

export function SelectMenu({
  children,
  noItemsMessage = "No options found",
  className,
  ...props
}: Props) {
  const hasChildren = Children.count(children);

  if (props.type === "select") {
    return (
      <SelectPopover
        className={cn(styles.SelectMenu, className)}
        sameWidth
        gutter={4}
        {...props}
      >
        {hasChildren ? (
          children
        ) : (
          <SelectItem isMessage={true}>{noItemsMessage}</SelectItem>
        )}
      </SelectPopover>
    );
  }

  return (
    <ComboboxPopover
      className={cn(styles.SelectMenu, className)}
      sameWidth
      gutter={4}
      {...props}
    >
      {hasChildren ? (
        children
      ) : (
        <ComboboxItem isMessage={true}>{noItemsMessage}</ComboboxItem>
      )}
    </ComboboxPopover>
  );
}
