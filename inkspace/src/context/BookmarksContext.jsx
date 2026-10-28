import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { KEYS, load, save } from "../utils/storage";

const BookmarksContext = createContext(null);

export function BookmarksProvider({ children }) {
  const [ids, setIds] = useState(() => load(KEYS.bookmarks, []));

  useEffect(() => {
    save(KEYS.bookmarks, ids);
  }, [ids]);

  const toggleBookmark = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isBookmarked = (id) => ids.includes(id);

  return (
    <BookmarksContext.Provider value={{ ids, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarksContext);