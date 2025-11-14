// src/components/main/EntryMain.jsx  (EntryMain)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";

import Logoimg from "./Logoimg";
import MainSearch from "./MainSearch";
import CategoryTag from "./CategoryTag";
import CategoryList from "./CategoryList";
import DetailBtn from "./DetailBtn";

import PrevBtn from "assets/main/prevBtn.svg";

import { cacheKey, fetchEntriesPaged, readCache, writeCache } from "utils/api";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { hintBrowser, removeHint } from "utils/cssUtil";
import { isItString } from "utils/util";

export default function EntryMain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [slideState, setSlideState] = useState({
    offset: 0,
    step: 0,
    maxOffset: 0,
  });

  // 검색 상태
  const [searchTerm, setSearchTerm] = useState("");

  // Dom 참조 (슬라이드)
  const listContainerRef = useRef(null);
  const listTrackRef = useRef(null);
  const offTimerRef = useRef(null);

  // Router 내비게이터
  const navigate = useNavigate();
  const { searchParams } = useFilterParamsValues();

  // API 결과에서 entries 배열과 길이 (슬라이드)
  const entries = fetchedData?.results ?? [];
  const entriesLength = entries.length;

  // 필터 상태(qs) → 캐시 키 문자열
  const qsString = useMemo(() => {
    // pIndex/pSize는 API 호출에서만 붙이고, 캐시 키에는 "필터만" 고정
    return new URLSearchParams(searchParams).toString();
  }, [searchParams]);

  // 전환 종료/취소 시 will-change 해제 (슬라이드)
  useEffect(() => {
    const el = listTrackRef.current;
    if (!el) return;

    const off = () => {
      removeHint(el);
      if (offTimerRef.current) {
        clearTimeout(offTimerRef.current);
        offTimerRef.current = null;
      }
    };

    const onEndOrCancel = (e) => {
      // transform만 감지하고 싶으니 필터
      if (e.propertyName !== "transform") return;
      off();
    };

    el.addEventListener("transitionend", onEndOrCancel);
    el.addEventListener("transitioncancel", onEndOrCancel);
    return () => {
      el.removeEventListener("transitionend", onEndOrCancel);
      el.removeEventListener("transitioncancel", onEndOrCancel);
      if (offTimerRef.current) clearTimeout(offTimerRef.current);
      removeHint(el); // 언마운트 중 전환 중이었을 때 대비
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 슬라이드 메트릭 계산 (슬라이드)
  const computeSlideMetrics = useCallback(() => {
    // 최신 Dom 참조를 위해 내부에서 선언
    const containerEl = listContainerRef.current;
    const trackEl = listTrackRef.current;

    if (!containerEl || !trackEl || entriesLength === 0) {
      setSlideState({ offset: 0, step: 0, maxOffset: 0 });
      return;
    }

    const firstItem = trackEl.querySelector(".imgCard");
    const computedStyle = window.getComputedStyle(trackEl);
    const gapValue = parseFloat(computedStyle.getPropertyValue("gap"));
    const gap = Number.isNaN(gapValue) ? 0 : gapValue;
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 0;

    const step = itemWidth + gap;
    const trackWidth = trackEl.scrollWidth;
    const viewportWidth = containerEl.clientWidth;
    const maxOffset = Math.max(0, trackWidth - viewportWidth);

    setSlideState((prev) => {
      const nextOffset = Math.min(prev.offset, maxOffset);
      return {
        offset: nextOffset,
        step,
        maxOffset,
      };
    });
  }, [entriesLength]);

  // 필터 변경 시 데이터 패치  (캐시 활용)
  // 1) 캐시 즉시표시  2) 백그라운드 재검증  3) 미스면 로딩 표시 후 패치
  useEffect(() => {
    const key = cacheKey(qsString);

    const hit = readCache(key);
    if (hit) {
      setFetchedData(hit);
      setLoading(false);
    } else {
      setFetchedData(null);
      setLoading(true);
    }

    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetchEntriesPaged({
          qs: searchParams, // URLSearchParams 그대로 전달
          page: 1,
          pageSize: 8,
          signal: ac.signal,
        });
        const normalized = {
          results: Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
            ? res
            : [],
          total:
            res?.total ??
            (Array.isArray(res?.results) ? res.results.length : 0),
          page: res?.page ?? 1,
          pageSize: res?.pageSize ?? 8,
          hasMore: res?.hasMore ?? false,
          nextPage: res?.nextPage ?? 2,
        };
        writeCache(key, normalized);
        setFetchedData(normalized);
        setError(null);
      } catch (e) {
        if (e.name !== "AbortError") {
          // 캐시 미스였던 경우에만 에러 표기
          if (!hit) setError(e);
        }
      } finally {
        if (!hit) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [searchParams]);

  // 슬라이드 상태 초기화 (슬라이드)
  useEffect(() => {
    setSlideState((prev) => ({ ...prev, offset: 0 }));
    computeSlideMetrics();
  }, [computeSlideMetrics, entriesLength]);

  // 리사이즈 시 슬라이드 메트릭 재계산 (슬라이드)
  useEffect(() => {
    window.addEventListener("resize", computeSlideMetrics);
    return () => window.removeEventListener("resize", computeSlideMetrics);
  }, [computeSlideMetrics]);

  // 이전 화살표 클릭 (슬라이드)
  const isAtEnd = slideState.maxOffset - slideState.offset <= 0.5;
  const hasScrollableContent = slideState.step > 0 && slideState.maxOffset > 0;

  // 이전 버튼 핸들러 (슬라이드)
  const handlePrevClick = useCallback(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // 시작 직전 hint on
    const listTrack = listTrackRef.current;
    if (!listTrack) return;
    hintBrowser(listTrack);

    // 트랜지션 유발
    setSlideState((prev) => {
      if (prev.step <= 0 || prev.maxOffset <= 0) return prev;

      if (prev.maxOffset - prev.offset <= 0.5) {
        return { ...prev, offset: 0 };
      }

      const nextOffset = Math.min(prev.offset + prev.step, prev.maxOffset);
      if (nextOffset === prev.offset) return prev;
      return { ...prev, offset: nextOffset };
    });

    // 0.45초 후에 hint off (transitionend/cancel 이벤트가 실패할 수도 있으니 백업)
    clearTimeout(offTimerRef.current);
    offTimerRef.current = setTimeout(() => removeHint(listTrack), 450);
  }, []);

  // 트랙 스타일 (슬라이드)
  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${slideState.offset}px)` }),
    [slideState.offset]
  );

  // 카테고리 클릭 시
  const onCategoryClick = (cateValue) => {
    const cateVal = isItString(cateValue);
    const params = new URLSearchParams();
    if (cateVal !== "전체") {
      params.set("cate", cateVal);
    }
    const qs = params.toString();
    navigate(qs ? `/list?${qs}` : `/list`);
  };

  // 이미지 카드 클릭 시
  const onImgCardClick = (titleValue) => {
    const titleVal = isItString(titleValue);
    const params = new URLSearchParams();
    params.set("title", titleVal);
    navigate(`/list?${params.toString()}`);
  };

  // 메인 검색 실행 시
  const onSearch = (searchInputValue) => {
    const termVal = isItString(searchInputValue).trim();
    if (termVal === "") {
      // 빈값이면 이동 안 함
      return;
    }
    // 빈값이 아닐 때 검색 실행
    const params = new URLSearchParams();
    if (termVal) {
      params.set("term", termVal);
    }
    const qs = params.toString();
    navigate(qs ? `/list?${qs}` : `/list`);
  };

  return (
    <main className="mainBox">
      {/* Title Section -------------------*/}
      <section className="title">
        <div className="titleBox">
          <div className="logoBox">
            <Logoimg />
          </div>
          <div className="searchBox">
            <MainSearch
              placeholder="전시회를 검색해보세요"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              onSearch={onSearch}
            />
          </div>
          <div className="tagBox">
            <CategoryTag handleCategoryClick={onCategoryClick} />
          </div>
        </div>
      </section>

      {/* Category = postlists ------------- */}
      <section className="category">
        <div className="categoryBox">
          {loading ? (
            <div className="statusMessage">Loading...</div>
          ) : error ? (
            <div className="statusMessage">Error : {error.message}</div>
          ) : (
            <>
              {/* arrowPrev */}
              <div
                className={`arrowPrev${
                  hasScrollableContent ? "" : " disabled"
                }${isAtEnd ? " reverse" : ""}`}
                role="button"
                tabIndex={hasScrollableContent ? 0 : -1}
                aria-label={isAtEnd ? "처음 카드로 이동" : "이전 카드 보기"}
                aria-disabled={!hasScrollableContent}
                onClick={hasScrollableContent ? handlePrevClick : undefined}
                onKeyDown={(event) => {
                  if (!hasScrollableContent) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handlePrevClick();
                  }
                }}
              >
                <ReactSVG src={PrevBtn} />
              </div>

              {/* 첫 화면 8개: 캐시/패치 결과의 results 배열만 전달 */}
              <CategoryList
                entries={entries}
                handleImgCardClick={onImgCardClick}
                containerRef={listContainerRef}
                trackRef={listTrackRef}
                trackStyle={trackStyle}
              />

              {/* 디테일 버튼 */}
              <DetailBtn href={"/list"} />
            </>
          )}
        </div>
        <div className="categoryBg"></div>
      </section>
    </main>
  );
}
