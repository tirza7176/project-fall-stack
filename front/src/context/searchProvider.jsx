import { createContext, useContext, useState } from "react";

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }) {
  const [inputSearch, setInputsearch] = useState("");
  return (
    <SearchContext.Provider value={{ inputSearch, setInputsearch }}>
      {children}
    </SearchContext.Provider>
  );
}
