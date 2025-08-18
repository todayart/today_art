// hooks/useCachedEntry.js
import { useEffect, useState } from "react";
import { fetchEntryByTitle } from "utils/api";

/**
 * 제목을 기반으로 로컬 캐시에서 엔트리를 검색하고, 없으면 API를 통해 가져옵니다.
 */
export function useCachedEntryByTitle(title) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    if (!title) return;
    console.log("useCachedEntry called with title:", title);

    const cacheKey = `entries:${title}`;
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
