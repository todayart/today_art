// utils/api.js
import { fetchData } from "./fetchData";

/**
 * 응답 스키마
 *
 * JSON 응답 예시:
 * {
 *   "results": page_items,    // object[]: 전시 목록
 *   "total": total,           // number: 전체 전시 수
 *   "page": p_index,          // number: 현재 페이지 번호
 *   "pageSize": p_size,       // number: 페이지당 전시 수
 *   "hasMore": has_more,      // boolean: 다음 페이지가 있는지 여부
 *   "nextPage": next_page     // number: 다음 페이지 번호
 * }
 *
 * @param { object[] } results - 전시 목록
 * @param { number } total - 전체 전시 수
 * @param { number } page - 현재 페이지 번호
 * @param { number } pageSize - 페이지당 전시 수
 * @param { boolean } hasMore - 다음 페이지가 있는지 여부
 * @param { number } nextPage - 다음 페이지 번호
 * @return {Promise<Object>} - 전시 목록 객체
 */

/**
 * 필터링된 전시 리스트 가져오기
 * @param {string} queryString - URLSearchParams를 직렬화한 문자열
 */
export function fetchEntries(queryString) {
  return fetchData(`http://localhost:8000/api/entries/?${queryString}`);
}

/**
 * 기존 fetchEntries는 유지(호환). 페이징 전용 fetchEntriesPaged 함수 추가
 */
export async function fetchEntriesPaged({
  qs,
  page = 1,
  pageSize = 8,
  signal,
}) {
  // qs: URLSearchParams 또는 직렬화된 문자열
  const base = typeof qs === "string" ? qs : new URLSearchParams(qs).toString();
  const url = `http://localhost:8000/api/entries/?${base}&pIndex=${page}&pSize=${pageSize}`;
  const res = await fetch(url, { signal, credentials: "include" });
  if (!res.ok) console.error(`HTTP ${res.status}`);
  return res.json(); // { results, total, page, pageSize, hasMore, nextPage }
}

/**
 * 특정 제목(term)에 해당하는 단일 전시 가져오기
 * @param {string} title
 * @return {Promise<Object|null>} - 전시 객체 또는 null
 */
export function fetchEntryByTitle(title) {
  const query = new URLSearchParams({ term: title });
  return fetchEntries(query.toString()).then((res) => {
    const { results } = res;
    // console.log("fetchEntryByTitle results:", results[0]);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  });
}

// 캐시 관련 유틸함수 ----------------
