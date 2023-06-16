import type { SelectStore } from "@ariakit/react/select";
import { createContext, useContext } from "react";

type SelectContextValue = {
  store: SelectStore;
};

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

type SelectProviderProps = SelectContextValue & {
  children: React.ReactNode;
};

/**
 * SelectProvider is a context provider which allows more flexible component composition for
 * Select components by providing the ariakit `store` to nested children (e.g. SelectItem).
 */
export const SelectProvider = ({ store, children }: SelectProviderProps) => {
  return (
    <SelectContext.Provider value={{ store }}>
      {children}
    </SelectContext.Provider>
  );
};

/**
 * This hook lets us expose our modal context in a type safe way without needing to supply
 * default arguments to React.createContext, which would be nonsensical.
 *
 * See: https://kentcdodds.com/blog/how-to-use-react-context-effectively#typescript--flow
 */
export function useSelect() {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error("useSelect must be used within a Select component");
  }
  return context;
}
