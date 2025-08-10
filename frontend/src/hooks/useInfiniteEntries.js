// src/hooks/useInfiniteEntries.js
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { fetchEntries } from "utils/api";

/**
 * @param {object}   baseParams   - term, cate … 등 공통 쿼리
 * @param {number}   pageSize     - 한 번에 가져올 개수 (리스트=8, 슬라이더=5)
 * @param {boolean}  autoScroll   - IntersectionObserver 사용 여부 (리스트 true, 슬라이더 false)
 *
 * @example 1 리스트
 * const {
 * items: cards,
 * loading,
 * error,
 * hasMore,
 * sentRef, // 관찰 대상 DOM 노드
 * } = useInfiniteEntries({ term, cate, startDate, endDate, sort }, { pageSize: 8, autoScroll: true });
 *
 * @ example 2 슬라이드
 *
 * const {
 *  items: slides,
 *  loading,
 *  error,
 *  nextPage,   // 수동 호출, onClick 이벤트로 페이지 증가
 * } = useInfiniteEntries({}, { pageSize: 5, autoScroll: false });
 *
 */
export function useInfiniteEntries(
  baseParams,
  { pageSize = 8, autoScroll = true } = {}
) {
  const [items, setItems] = useState([]); // 저장용
  const [page, setPage] = useState(1);
  const [loading, setLoad] = useState(false); // 중복 호출 방지
  const [hasMore, setMore] = useState(true); // 다음 페이지 여부
  const [error, setErr] = useState(null);
  const sentRef = useRef(null); // 관찰할 DOM 노드(IntersectionObserver용)

  /* 필터 변경 → 초기화 */
  const key = useMemo(() => JSON.stringify(baseParams), [baseParams]);
  useEffect(() => {
    console.log("useInfiniteEntries key 변경", key);
    setItems([]);
    setPage(1);
    setMore(true);
    setErr(null);
  }, [key]);

  /* page 변경 시 fetch */
  useEffect(() => {
    // console.log("useInfiniteEntries useEffect", baseParams, page);
    if (loading || !hasMore) return; // 로딩 중이거나 더 이상 가져올 데이터가 없으면 중단
    let cancel = false;

    (async () => {
      setLoad(true);
      try {
        const qsObj = { ...baseParams, page, pageSize }; // 쿼리 파라미터 설정
        const data = await fetchEntries(qsObj);
        console.log("qsObj:", qsObj);
        console.log("Fetched data:", data);
        if (cancel) return;
        setItems((prev) => [...prev, ...data]);
        console.log("Updated items:", items);
        if (data.length < pageSize) setMore(false); // 더 이상 데이터가 없으면 hasMore false, 트리거 역할
      } catch (e) {
        if (!cancel) setErr(e.message);
      } finally {
        if (!cancel) setLoad(false);
        console.log("Loading state:", loading);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [page]);

  /* IntersectionObserver 등록 */
  useEffect(() => {
    console.log(
      "useInfiniteEntries useEffect - IntersectionObserver",
      autoScroll,
      hasMore
    );
    if (!autoScroll || !hasMore) return;
    const node = sentRef.current;
    // console.log("sentRef.current:", node);
    if (!node) return;

    // callback 함수: 관찰 대상이 화면에 들어오면 page 증가
    // 옵션 :
    // rootMargin: 관찰 대상이 화면에 들어오기 전 200px까지 미리 로드
    // threshold: 0은 관찰 대상이 화면에 조금이라도 들어오면 트리거
    const io = new IntersectionObserver(
      ([ent]) => ent.isIntersecting && setPage((p) => p + 1),
      { rootMargin: "200px", threshold: 0 }
    );
    io.observe(node);
    return () => io.disconnect(); // 정리
  }, [hasMore]); // autoScroll 값은 고정이므로 제외

  /* 5) 수동 페이지 이동용 헬퍼 (슬라이더용) */
  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const reset = useCallback(() => setPage(1), []);

  return { items, loading, error, hasMore, sentRef, nextPage, reset };
}
