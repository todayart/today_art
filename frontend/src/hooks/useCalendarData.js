// src/hooks/useCalendarData.js
// 캘린더 전시 데이터 가져오기 커스텀 훅

import { useCallback, useEffect, useState } from "react";
import { fetchData } from "utils/fetchData";
// * 백앤드 API 베이스 URL 사용 시
import { API_BASE } from "utils/api";

// 기본 URL 설정 (환경 변수 또는 로컬호스트)
const DEFAULT_URL = API_BASE
  ? `${API_BASE}/api/calendar/`
  : "http://localhost:8000/api/calendar/";

/**
 * 캘린더 데이터를 가져오고 관리하는 커스텀 훅
 *
 * @param {Object} [options={}] - 설정 옵션
 * @param {string} [options.url=DEFAULT_URL] - 캘린더 데이터를 가져올 URL
 * @returns {Object} 훅 반환 객체
 * @returns {Object} returns.data - 가져온 캘린더 데이터 객체
 * @returns {boolean} returns.loading - 로딩 상태 표시
 * @returns {Error|null} returns.error - 요청 실패 시 에러 객체, 성공 시 null
 * @returns {Function} returns.refetch - 데이터 재요청을 트리거하는 함수
 *
 * @example
 * const { data, loading, error, refetch } = useCalendarData();
 *
 * @example
 * const { data, loading, error, refetch } = useCalendarData({
 *   url: 'http://api.example.com/calendar'
 * });
 */

export default function useCalendarData({ url = DEFAULT_URL } = {}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // refetch 함수: 데이터 재요청을 트리거
  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchData(url, { signal: controller.signal })
      .then((result) => {
        if (!isActive) return;
        setData(result ?? {});
      })
      .catch((err) => {
        if (!isActive || err?.name === "AbortError") return;
        setError(err);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [url, reloadKey]);

  return { data, loading, error, refetch };
}
