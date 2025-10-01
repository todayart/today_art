// frontend/src/utils/cssUtil.js

// CSS 관련 유틸 함수

// 요소에 GPU 가속 힌트 주기
export function hintBrowser(el, props = "transform") {
  if (el) el.style.willChange = props;
}

// 요소에 GPU 가속 힌트 제거
export function removeHint(el) {
  if (el) el.style.willChange = "";
}
