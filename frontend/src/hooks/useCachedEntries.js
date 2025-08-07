// hooks/useCachedEntries.js
import { useState, useEffect } from "react";
import { fetchEntries } from "utils/api";

const CACHE_KEY = "entries:all";
const CACHE_TTL_MS = 1000 * 60 * 10; // 10분 (600,000ms)

/**
 * queryString에 따라 데이터 fetch 및 sessionStorage 캐싱 (타임스탬프 포함)
 */
export function useCachedEntries(queryString) {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheRaw = sessionStorage.getItem(CACHE_KEY);

    if (cacheRaw) {
      try {
        const { data, cachedAt } = JSON.parse(cacheRaw);
        const now = Date.now();
        const isValid = now - cachedAt < CACHE_TTL_MS;

        if (isValid) {
          setEntries(data); // 1차 캐시 반환
          setLoading(false);
        }
      } catch (e) {
        console.warn("캐시 파싱 실패:", e);
      }
    }

    // 항상 최신 데이터 fetch 시도
    fetchEntries(queryString)
      .then((data) => {
        setEntries(data); // 2차 fetch 결과 덮어쓰기
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, cachedAt: Date.now() })
        );
        setError(null);
      })
      .catch((err) => {
        console.error("entries fetch error", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  return { entries, loading, error };
}
