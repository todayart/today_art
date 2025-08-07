// utils/api.js
import { fetchData } from "./fetchData";

/**
 * 필터링된 전시 리스트 가져오기
 * @param {string} queryString - URLSearchParams를 직렬화한 문자열
 */
export function fetchEntries(queryString) {
  return fetchData(`http://localhost:8000/api/entries/?${queryString}`);
}

/**
 * 특정 제목(term)에 해당하는 단일 전시 가져오기
 * @param {string} title
 */
export function fetchEntryByTitle(title) {
  const query = new URLSearchParams({ term: title });
  return fetchEntries(query.toString()).then((res) => res[0] || null);
}

/**
 * sessionStorage 제거
 */
export function clearCache() {
  console.log("Clearing cache...");
  const CACHE_KEY = "entries:all";
  sessionStorage.removeItem(CACHE_KEY);
  window.location.reload(); // 또는 setReloadTrigger(v => !v)
}
