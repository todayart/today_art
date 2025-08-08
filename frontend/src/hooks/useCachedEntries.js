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

  // ! drop 이유 : useCachedEntries는 queryString이 변경될 때마다 새로 fetch를 시도하기 때문에 이전 쿼리와 비교할 필요가 없다.
  // const [beforeQuery, setBeforeQuery] = useState(null);

  useEffect(() => {
    const cacheRaw = sessionStorage.getItem(CACHE_KEY);
    if (cacheRaw) {
      try {
        const { data, cachedAt } = JSON.parse(cacheRaw);
        const now = Date.now();
        const isValid = now - cachedAt < CACHE_TTL_MS;

        if (isValid) {
          console.log("캐시된 엔트리 사용");
          setEntries(data); // 1차 캐시 반환
          setLoading(false);
          // return
        }
      } catch (e) {
        console.warn("캐시 파싱 실패:", e);
      }
    }
    console.log("새로운 데이터 fetch");
    fetchEntries(queryString)
      .then((data) => {
        setEntries(data); // 2차 fetch 결과 덮어쓰기
        console.log("새로운 엔트리 데이터 fetch 완료");
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, cachedAt: Date.now() })
        );
        console.log("엔트리 캐시 업데이트");
        // setBeforeQuery(queryString);
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
