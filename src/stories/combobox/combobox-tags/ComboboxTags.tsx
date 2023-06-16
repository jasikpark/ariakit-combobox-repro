import { Combobox, useComboboxStore } from "@ariakit/react/combobox";
import cn from "classnames";
import { useDeferredValue, useMemo, useRef } from "react";
import {
  useController,
  type FieldPathByValue,
  type UseControllerProps,
} from "react-hook-form";
import { useGetMaxTagsQuery } from "./useGetMaxTagsQuery";
import { SelectMenu } from "../../select-menu/SelectMenu";
import { useMergedRefs } from "./useMergedRefs";
import { ComboboxItem } from "../combobox-item/ComboboxItem";
import { matchTags } from "../match-tags";
import styles from "./ComboboxTags.module.css";

type Props<
  T extends { tags: string[] },
  N extends FieldPathByValue<T, string[]>
> = UseControllerProps<T, N>;

/**
 * A react-hook-form controlled component to show an editable list of tags.
 * The user can type into the input to filter a list of available tags (fetched from the server),
 * and select them.
 */
export function ComboboxTags<
  T extends { tags: string[] },
  N extends FieldPathByValue<T, string[]>
>({ name, control }: Props<T, N>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tags: allTags = [], isLoading: isLoadingAllTags } =
    useGetMaxTagsQuery();
  const combobox = useComboboxStore({
    resetValueOnHide: true,
  });
  const comboboxValue = combobox.useState("value");
  const deferredValue = useDeferredValue(comboboxValue);
  const {
    field: { value: formValue, onChange, onBlur, ref: formRef },
  } = useController<T>({
    name,
    control,
  });
  // My TypeScript is failing, this should always be an array, but it's turning into string | string[] instead
  const tags = formValue as string[];

  // Combine ref from react-hook-form with ours
  const ref = useMergedRefs(formRef, inputRef);

  const matches = useMemo(
    () =>
      matchTags(allTags, deferredValue)
        // filter out tags that have already been added
        .filter((t) => !tags.includes(t)),
    [deferredValue, allTags, tags]
  );

  function getAnchorRect() {
    if (!containerRef.current) return null;
    return containerRef.current.getBoundingClientRect();
  }

  function focusInput() {
    ref.current?.focus();
  }

  function addTag(tag: string) {
    combobox.setValue("");
    onChange(tags.concat(tag));
  }

  function removeTag(index: number) {
    const modifiedArray = [...formValue];
    // Remove the element at index
    modifiedArray.splice(index, 1);
    // Hide the popover when removing tags
    combobox.hide();
    onChange(modifiedArray);
  }

  /**
   * Potentially create a row for the bottom of the popover menu when the user is trying to create a new tag.
   * We'll either show a validation error message or a `Create <X>` option.
   */
  function makeFallbackOption() {
    // If the user hasn't typed anything, don't show a bottom row
    if (!comboboxValue) return null;

    // Check if the user is trying to create a new tag, only show if no other matches
    const validationError = validateNewTag(comboboxValue);
    if (comboboxValue && validationError && !matches.length) {
      return (
        <ComboboxItem
          key={comboboxValue}
          value={comboboxValue}
          setValueOnClick={false}
          hideOnClick={false}
          isMessage
        >
          {validationError}
        </ComboboxItem>
      );
    }

    // If they've typed a valid creatable, show it as an option
    if (!validationError) {
      return (
        <ComboboxItem
          key={comboboxValue}
          value={comboboxValue}
          onClick={() => addTag(comboboxValue)}
          setValueOnClick={false}
          hideOnClick={false}
        >
          Create {comboboxValue}
        </ComboboxItem>
      );
    }

    return null;
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!comboboxValue && event.key === "Backspace") {
      removeTag(-1);
    }
  };

  return (
    <div
      className={cn("border-focusable", styles.ComboboxTags)}
      ref={containerRef}
      onClick={focusInput}
    >
      <div className={styles.ComboboxTags_tagList}>
        {tags.map((tag: string, i) => (
          <button
            className={styles.ComboboxTags_tagPill}
            key={tag}
            onClick={() => removeTag(i)}
            style={{
              backgroundColor:
                !isLoadingAllTags && !allTags.includes(tag)
                  ? "green"
                  : undefined,
            }}
          >
            {tag}
          </button>
        ))}
        <Combobox
          store={combobox}
          ref={ref}
          onBlur={onBlur}
          className={styles.ComboboxTags_input}
          placeholder={tags.length ? "" : "Choose tags…"}
          autoSelect={true}
          render={(htmlProps) => (
            <input
              {...htmlProps}
              onKeyDown={(e) => {
                onKeyDown(e);
                htmlProps.onKeyDown?.(e);
              }}
            />
          )}
        />
      </div>
      {/** Only show the ComboboxPopover when we have an item to show */}
      {matches.length || makeFallbackOption() ? (
        <SelectMenu
          className={styles.ComboboxTags_menu}
          type="combobox"
          store={combobox}
          getAnchorRect={getAnchorRect}
          noItemsMessage="No tags found"
          gutter={4}
        >
          {matches.map((val) => (
            <ComboboxItem
              key={val}
              value={val}
              onClick={() => addTag(val)}
              setValueOnClick={false}
              hideOnClick={false}
            >
              {val}
            </ComboboxItem>
          ))}
          {makeFallbackOption()}
        </SelectMenu>
      ) : null}
    </div>
  );
}

function validateNewTag(tag: string) {
  if (!tag.includes(":")) {
    return "Tag must include a colon (:)";
  }

  const [key, value] = tag.split(":");

  if (!key || !value) {
    return "Tag must include a key and value";
  }

  if (key.trim() !== key || value.trim() !== value) {
    return "Invalid tag format";
  }

  if (key.length > 20) {
    return "Tag keys cannot be longer than 20 characters";
  }

  if (value.length > 50) {
    return "Tag values cannot be longer than 50 characters";
  }

  return undefined;
}
