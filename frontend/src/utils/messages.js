export function formatErrorMessage(error) {
  const message =
    error && typeof error.message === "string" && error.message.trim()
      ? error.message
      : "알 수 없는 오류가 발생했습니다.";
  return `에러: ${message}`;
}
