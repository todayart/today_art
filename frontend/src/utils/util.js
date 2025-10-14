// frontend/src/utils/util.js

// 일반 유틸 함수 모음

/**
 * 디바운스 함수 - 연속된 함수 호출을 지연시켜 마지막 호출만 실행
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} 디바운스된 함수
 *
 * @example
 * // 검색 입력 디바운스
 * const debouncedSearch = debounce((searchTerm) => {
 *   console.log('검색:', searchTerm);
 * }, 300);
 *
 * // 사용법
 * debouncedSearch('검색어'); // 300ms 후 실행
 *
 * @example
 * // React 컴포넌트에서 사용
 * import { debounce } from './utils/util.js';
 *
 * const SearchComponent = () => {
 *   const handleSearch = debounce((value) => {
 *     // API 호출 또는 검색 로직
 *     fetchSearchResults(value);
 *   }, 500);
 *
 *   return (
 *     <input
 *       onChange={(e) => handleSearch(e.target.value)}
 *       placeholder="검색어 입력"
 *     />
 *   );
 * };
 */
export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
