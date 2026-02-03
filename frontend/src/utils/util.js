// frontend/src/utils/util.js

// 값을 문자열로 보장하는 유틸 함수
export const isItString = (value) => {
  return typeof value === "string" ? value : String(value ?? "");
};

// 문자열 입력을 안전하게 정규화
export const normalizeString = (value, fallback = "") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

// 테마 전용 정규화 ->기본값을 명확히 하기 위해 래핑
export const normalizeTheme = (value, fallback = "default") =>
  normalizeString(value, fallback);
