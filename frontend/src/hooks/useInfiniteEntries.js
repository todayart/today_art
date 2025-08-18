// src/hooks/useInfiniteEntries.js

/**
 * 무한 스크롤을 위한 엔트리 목록 훅
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cacheKey, fetchEntriesPaged, readCache, writeCache } from "utils/api";

export function useInfiniteEntries({ qs, pageSize = 8, enabled = true }) {
  const key = useMemo(() => cacheKey(qs, pageSize), [qs, pageSize]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // 중복 제거 키: URL 있으면 URL, 없으면 TITLE
  const uniqKey = (e) => e.URL || e.TITLE;

  // 초기화 & 캐시 히트 적용
  useEffect(() => {
    const hit = readCache(key);
    if (hit) {
      setItems(hit.items || []);
      setPage(hit.meta?.nextPage ?? hit.pageLoaded + 1 ?? 2);
      setHasMore(hit.meta?.hasMore ?? true);
      setError(null);
      return;
    }
    // 캐시 미스면 빈 상태로 1페이지부터
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [key]);

  const fetchPage = useCallback(
    async (targetPage) => {
      if (!enabled || loading || !hasMore) return;
      setLoading(true);
      setError(null);

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetchEntriesPaged({
          qs,
          page: targetPage,
          pageSize,
          signal: ac.signal,
        });

        const next = res.results ?? [];
        setItems((prev) => {
          const map = new Map(prev.map((e) => [uniqKey(e), e]));
          for (const e of next) map.set(uniqKey(e), e);
          const merged = Array.from(map.values());
          // 캐시 업데이트
          writeCache(key, {
            items: merged,
            pageLoaded: targetPage,
            meta: {
              total: res.total ?? merged.length,
              pageSize,
              hasMore:
                res.hasMore ?? merged.length < (res.total ?? merged.length),
              nextPage: res.nextPage ?? (res.hasMore ? targetPage + 1 : null),
            },
          });
          return merged;
        });

        setHasMore(res.hasMore ?? !!res.nextPage);
        setPage(res.nextPage ?? (res.hasMore ? targetPage + 1 : targetPage));
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    },
    [qs, pageSize, enabled, hasMore, loading, key]
  );

  // 첫 로드 시 1페이지 자동 로드(캐시 미스일 때만 필요)
  useEffect(() => {
    console.log("useInfiniteEntries: Initial fetch for page 1");
    const hit = readCache(key);
    if (!hit && enabled)
      fetchPage(1).then(() => {
        console.log("useInfiniteEntries: Initial fetch completed");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // IO 구현
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const [it] = entries;
      if (it.isIntersecting && hasMore && !loading) fetchPage(page);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, page, hasMore, loading, fetchPage]);

  return {
    items, // Array
    hasMore, // boolean
    loading, // boolean
    error, // any
    loadMore: () => fetchPage(page),
    sentinelRef, // attach to <div ref={sentinelRef} />
    page,
  };
}
