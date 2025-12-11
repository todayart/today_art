// src/stores/resetStore.js
import React from "react";

/*
  전역 리셋 이벤트 스토어
  구독/발행 패턴을 사용하여 컴포넌트들이 리셋 이벤트를 수신할 수 있도록 함
  
  사용법:
  1. 구독: useResetSubscription 훅을 사용하여 컴포넌트에서 리셋 핸들러 등록
    - 예: useResetSubscription(() => { ...리셋 로직... }); 
  2. 발행: emitReset 함수를 호출하여 모든 구독자에게 리셋 이벤트 전파
    - 예: emitReset();
*/

const listeners = new Set();

/**
 * 리스너를 구독합니다.
 * @param {Function} listener - 리셋 이벤트를 처리할 콜백 함수
 * @returns {Function} 구독 해제 함수
 */
export function subscribe(listener) {
  if (typeof listener !== "function") return () => {};
  listeners.add(listener);
  return () => unsubscribe(listener);
}

/**
 * 리스너의 구독을 해제합니다.
 * @param {Function} listener - 구독 해제할 리스너 함수
 */
export function unsubscribe(listener) {
  listeners.delete(listener);
}

/**
 * 모든 등록된 리스너들에게 리셋 이벤트를 발신(emit)합니다.
 * emit은 이벤트를 방출하거나 발송한다는 의미로, 여기서는 리셋 신호를 전달합니다.
 * 각 리스너 실행 중 발생하는 오류는 다른 리스너의 실행에 영향을 주지 않도록 처리됩니다.
 *
 * @function emitReset
 * @description 등록된 모든 리스너 함수들을 순차적으로 실행하여 리셋 이벤트를 전파합니다.
 * @throws {Error} 개별 리스너에서 발생한 오류는 콘솔에 로그되고 무시됩니다.
 */
export function emitReset() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      // 오류를 무시하여 다른 리스너에 영향 주지 않음
      console.error("[ResetStore] listener error:", e);
    }
  });
}

// 커스텀 훅: 컴포넌트에서 리셋 이벤트 구독
/**
 * 컴포넌트에서 리셋 이벤트를 구독하는 커스텀 훅
 * @param {Function} handler - 리셋 이벤트 발생 시 실행할 콜백 함수
 */
export function useResetSubscription(handler) {
  React.useEffect(() => {
    if (typeof handler !== "function") return undefined;
    const off = subscribe(handler);
    return () => off();
  }, [handler]);
}
