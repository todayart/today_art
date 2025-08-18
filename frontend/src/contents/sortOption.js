//contents/sortOption.js

/**
 * 정렬 옵션 관리
 * 이 파일은 정렬 옵션을 관리하는 매핑 테이블을 포함합니다.
 * ListPage.jsx에서 사용되어 URL 파라미터와 정렬 상태를 동기화합니다.
 */

// 정렬 상태 관리
export const SORT_MAP = {
  정렬순: "",
  최신순: "-begin_de",
  임박순: "end_de",
  // "제목 오름차순": "title",
  // "제목 내림차순": "-title",
};

export const REVERSE_SORT_MAP = Object.fromEntries(
  Object.entries(SORT_MAP).map(([k, v]) => [v, k])
);
