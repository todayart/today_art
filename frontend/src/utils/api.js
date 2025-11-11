// utils/api.js
import { fetchData } from "./fetchData";
import { getQSInt, safeInt } from "./numberUtil";

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

// * 환경 변수 기반 API 베이스 URL
export const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

/**
 * 필터링된 전시 리스트 가져오기
 * @param {string} queryString - URLSearchParams를 직렬화한 문자열
 */
export function fetchEntries(queryString) {
  return fetchData(`${API_BASE}/api/entries/?${queryString}`);
}

/**
 * 기존 fetchEntries는 유지(호환). 페이징 전용 fetchEntriesPaged 함수 추가
 * @param {Object} params
 * @param {URLSearchParams|string|Object|null} params.qs - 필터 파라미터
 * @param {number} [params.page=1] - 기본 1
 * @param {number} [params.pageSize=8] - 기본 8
 * @param {AbortSignal} [params.signal] - fetch 취소용
 * @returns {Promise<any>} - { results, total, page, pageSize, hasMore, nextPage }
 * @example
 * fetchEntriesPaged({ qs: new URLSearchParams({ cate: "React" }), page: 1, pageSize: 8 })
 */
export async function fetchEntriesPaged({
  qs,
  page = 1,
  pageSize = 8,
  signal,
}) {
  // 1) qs를 URLSearchParams로 정규화해야 함
  let qsParams;
  if (qs == null) {
    qsParams = new URLSearchParams();
  } else if (typeof qs === "string") {
    // "a=1&b=2" 형태
    qsParams = new URLSearchParams(qs);
  } else if (
    typeof qs.toString === "function" &&
    qs instanceof URLSearchParams
  ) {
    qsParams = new URLSearchParams(qs); // 복사본
  } else if (typeof qs === "object") {
    // 평범한 객체도 허용 (ex. { cate: "React" })
    qsParams = new URLSearchParams(qs);
  } else {
    // 알 수 없는 타입은 빈 파라미터로
    qsParams = new URLSearchParams();
  }

  // 2) 인자로 받은 page/pageSize도 안전 보정
  const pageSafeArg = safeInt(page, 1, "arg:page");
  const sizeSafeArg = safeInt(pageSize, 8, "arg:pageSize");

  // 3) qs 내부에 pIndex/pSize가 있으면 그것도 안전 보정
  const qsPage = getQSInt(qsParams, "pIndex", pageSafeArg);
  const qsSize = getQSInt(qsParams, "pSize", sizeSafeArg);

  // 4) 최종 파라미터 구성: 필터는 유지하고 pIndex/pSize를 안전값으로 덮어쓰기
  qsParams.set("pIndex", String(qsPage));
  qsParams.set("pSize", String(qsSize));

  // 5) 최종 URL
  const finalUrl = `${API_BASE}/api/entries/?${qsParams.toString()}`;

  // 6) 개발 중엔 항상 로깅하여 Network 탭과 비교 확인
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV !== "production"
  ) {
    console.log("[fetchEntriesPaged] GET", finalUrl);
  }

  // 7) 요청
  const res = await fetch(finalUrl, { signal, credentials: "include" });
  if (!res.ok) {
    console.error(`HTTP ${res.status} for ${finalUrl}`);
  }
  return res.json(); // { results, total, page, pageSize, hasMore, nextPage }
}

/**
 * 특정 제목(term)에 해당하는 단일 전시 가져오기
 * @param {string} title
 * @return {Promise<Object|null>} - 전시 객체 또는 null
 * @example
 * fetchEntryByTitle("My Title").then(item => console.log(item));
 */
export function fetchEntryByTitle(title) {
  const query = new URLSearchParams({ term: title });
  return fetchEntries(query.toString()).then((res) => {
    const { results } = res;
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  });
}

// 캐시 관련 유틸함수 ----------------

const TTL = 10 * 60 * 1000; // 10분

export const qsToString = (qs) => {
  if (qs == null) return "";
  if (typeof qs === "string") return qs;
  if (qs && typeof qs.toString === "function") return qs.toString();
  return new URLSearchParams(qs).toString();
};

export const cacheKey = (qs, pageSize, pageIndex = 1) =>
  `entries:${qsToString(qs)}:p${pageIndex}:s${pageSize}`;

export const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > TTL) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const writeCache = (key, data) => {
  sessionStorage.setItem(
    key,
    JSON.stringify({ ...data, cachedAt: Date.now() })
  );
};

/** 외부에서 선패치할 때 사용(Entry 페이지 등) */
export async function prefetchFirstPage({ qs, pageSize = 8, signal }) {
  const key = cacheKey(qs, pageSize, 1);
  const hit = readCache(key);
  if (hit?.pageLoaded >= 1) return; // 이미 예열됨

  const page1 = await fetchEntriesPaged({ qs, page: 1, pageSize, signal });
  const items = page1.results ?? [];
  writeCache(key, {
    items,
    pageLoaded: 1,
    meta: {
      total: page1.total ?? items.length,
      pageSize,
      hasMore: page1.hasMore ?? items.length >= pageSize,
      nextPage: page1.nextPage ?? 2,
    },
  });
}
