// hooks/useSearchParamsValues.js
import { useFilterParams } from "./useFilterParams";

/**
 * search 파라미터의 값을 가져와 반환하는 훅입니다.
 * * URLSearchParams에서 주요 파라미터 값을 추출
 * → 매번 searchParams.get("key") 반복 방지
 *
 * 이 함수는 URL의 search 파라미터 값을 읽어 다음과 같은 객체를 반환합니다:
 *   - term: 검색어 (string)
 *   - startDate: 시작 날짜 (string)
 *   - endDate: 종료 날짜 (string)
 *   - cate: 카테고리 (string)
 *   - sort: 정렬 기준 (string)
 *   - searchParams: 원본 URLSearchParams 객체 (URLSearchParams)
 *
 * @returns {object} 파라미터 값을 포함하는 객체
 *
 * @example
 * // 사용 예시: useSearchParamsValues 훅을 통해 URL의 검색 파라미터를 읽어옵니다.
 * import { useSearchParamsValues } from './hooks/useFilterParamsValues';
 *
 * function SearchComponent() {
 *   const { term, startDate, endDate, cate, sort, searchParams } = useSearchParamsValues();
 *
 *   console.log('검색어:', term);
 *   console.log('시작 날짜:', startDate);
 *   console.log('종료 날짜:', endDate);
 *   console.log('카테고리:', cate);
 *   console.log('정렬 기준:', sort);
 *
 *   // 추가 로직...
 * }
 */
export function useFilterParamsValues() {
  const [searchParams] = useFilterParams();

  return {
    term: searchParams.get("term") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    cate: searchParams.get("cate") || "",
    sort: searchParams.get("sort") || "",
    searchParams,
  };
}
