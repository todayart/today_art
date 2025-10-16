/* -------------------------------------------------------
 * 안전한 정수 변환 유틸
 *  - NaN/Infinity/undefined/null/빈 문자열 등 비유한값이면 fallback으로 교체해야 함
 *  - 개발 중에는 콘솔 경고 + 디버거 중단점으로 "최초 발생 지점"을 잡아야 함
 * -----------------------------------------------------*/

/**
 * @param {unknown} v           변환 대상
 * @param {number}  fallback    대체값 (예: 페이지 1, 사이즈 8)
 * @param {string}  label       디버깅 라벨
 * @returns {number}
 * @example
 * safeInt("3", 1, "pIndex"); // 3
 * safeInt(undefined, 1, "pIndex"); // 1 (경고 출력)
 */
export function safeInt(v, fallback, label) {
  let n;
  if (typeof v === "number") n = v;
  else if (typeof v === "string") n = parseInt(v, 10);
  else n = NaN;

  if (!Number.isFinite(n)) {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(`[safeInt] ${label} → fallback(${fallback}). value=`, v);
      // 디버깅 중단점: 어디서 잘못 들어오는지 콜스택 확인에 유용
      // eslint-disable-next-line no-debugger
      debugger;
    }
    return fallback;
  }
  return n;
}

/**
 * URLSearchParams에서 안전한 정수 읽기
 * @param {URLSearchParams|null|undefined} qs
 * @param {string} key
 * @param {number} fallback
 * @returns {number}
 * @example
 * getQSInt(new URLSearchParams("pIndex=2"), "pIndex", 1); // 2
 * getQSInt(null, "pIndex", 1); // 1
 */
export function getQSInt(qs, key, fallback) {
  if (!qs) return fallback;
  const raw = qs.get ? qs.get(key) : undefined;
  return safeInt(raw, fallback, `QS:${key}`);
}
