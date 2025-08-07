// hooks/useCachedEntry.js
import { useEffect, useState } from "react";
import { fetchEntryByTitle } from "utils/api";

/**
 * title 기준으로 로컬 캐시에서 검색하고, 없으면 fetch
 */
export function useCachedEntry(title) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    if (!title) return;

    const cacheKey = `entry:${title}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      setEntry(JSON.parse(cached));
    } else {
      fetchEntryByTitle(title).then((data) => {
        if (data) {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          setEntry(data);
        }
      });
    }
  }, [title]);

  return entry;
}
