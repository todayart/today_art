// hooks/useSortParam.js
import { useCallback } from "react";
import { SORT_MAP, REVERSE_SORT_MAP } from "contents/sortOption";

export function useSortParam(searchParams, updateFilterParams) {
  // 파생된 선택지
  const sortParam = searchParams.get("sort") || "";
  const sortOption = REVERSE_SORT_MAP[sortParam] || "정렬순";

  // 콜백
  const onSortChange = useCallback(
    (newSort) => {
      updateFilterParams({ sort: SORT_MAP[newSort] || "" });
    },
    [updateFilterParams]
  );

  return [sortOption, onSortChange];
}
