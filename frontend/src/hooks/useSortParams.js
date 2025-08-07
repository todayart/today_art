import { useCallback } from "react";
import { useFilterParams } from "./useFilterParams";
import { SORT_MAP, REVERSE_SORT_MAP } from "contents/sortOption";

/**
 * URL의 sort 쿼리 → UI에 표시할 옵션으로 변환하고,
 * 옵션 변경 시 URL을 갱신하는 콜백을 제공합니다.
 *
 * @returns {[ string, (newSort: string) => void ]}
 *   - sortOption: UI에 표시할 정렬 라벨
 *   - onSortChange: 새로운 라벨을 받아 URL 갱신
 */
export function useSortParam() {
  // searchParams, updateFilterParams 가져오기
  const [searchParams, updateFilterParams] = useFilterParams();

  // sortParam (실제 URL 값)
  const sortParam = searchParams.get("sort") || "";

  // UI에 사용할 라벨로 매핑 (파생 상태)
  const sortOption = REVERSE_SORT_MAP[sortParam] || "정렬순";

  // 옵션 선택 시 URL 갱신 콜백
  const onSortChange = useCallback(
    (newSort) => {
      const value = SORT_MAP[newSort] || "";
      updateFilterParams({ sort: value });
    },
    [updateFilterParams]
  );

  return [sortOption, onSortChange];
}
