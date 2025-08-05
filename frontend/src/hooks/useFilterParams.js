// src/hooks/useFilterParams.js

import { useSearchParams } from "react-router-dom";

/**
 * URL 쿼리스트링(searchParams)과
 * 파라미터 업데이트 함수(updateFilterParams)를 반환
 *
 * @returns {[ URLSearchParams, (updates: Record<string, string|null>) => void ]}
 */
export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilterParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, val]) => {
      if (val != null && val !== "") params.set(key, val);
      else params.delete(key);
    });

    // 필터 변경 시 항상 페이지 인덱스 초기화
    params.set("pIndex", "1");
    setSearchParams(params);
  };

  return [searchParams, updateFilterParams];
}
