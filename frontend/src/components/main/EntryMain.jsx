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

import { fetchEntriesPaged } from "utils/api";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { hintBrowser, removeHint } from "utils/cssUtil";

const TTL = 10 * 60 * 1000; // 10분

function cacheKey(qsString) {
  // 1페이지, 8개 예열 캐시 키(필터별 분리)
  return `entries:${qsString}:p1:s8`;
}
function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.cachedAt || Date.now() - parsed.cachedAt > TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}
function writeCache(key, data) {
  sessionStorage.setItem(
    key,
    JSON.stringify({ ...data, cachedAt: Date.now() })
  );
}

export default function EntryMain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [slideState, setSlideState] = useState({
    offset: 0,
    step: 0,
    maxOffset: 0,
  });

  const listContainerRef = useRef(null);
  const listTrackRef = useRef(null);

  const navigate = useNavigate();
  const { searchParams } = useFilterParamsValues();

  const entries = fetchedData?.results ?? [];
  const entriesLength = entries.length;

  // 필터 상태(qs) → 캐시 키 문자열
  const qsString = useMemo(() => {
    // pIndex/pSize는 API 호출에서만 붙이고, 캐시 키에는 "필터만" 고정
    return new URLSearchParams(searchParams).toString();
  }, [searchParams]);

  const computeSlideMetrics = useCallback(() => {
    // 최신 Dom 참조를 위해 내부에서 선언
    const containerEl = listContainerRef.current;
    const trackEl = listTrackRef.current;

    if (!containerEl || !trackEl || entriesLength === 0) {
      setSlideState({ offset: 0, step: 0, maxOffset: 0 });
      return;
    }
    // ? <trackEl>에 GPU 가속 힌트 주기
    // willChange라는 것을 찾을 수 없다는 오류가 발생
    // 이걸 여기에 쓰는게 적절할까?
    trackEl.addEventListener("mouseenter", hintBrowser);
    trackEl.addEventListener("mouseleave", removeHint);

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
  }, [qsString, searchParams]);

  useEffect(() => {
    setSlideState((prev) => ({ ...prev, offset: 0 }));
    computeSlideMetrics();
  }, [computeSlideMetrics, entriesLength]);

  useEffect(() => {
    window.addEventListener("resize", computeSlideMetrics);
    return () => window.removeEventListener("resize", computeSlideMetrics);
  }, [computeSlideMetrics]);

  const handlePrevClick = useCallback(() => {
    setSlideState((prev) => {
      if (prev.step <= 0) return prev;
      const nextOffset = Math.min(prev.offset + prev.step, prev.maxOffset);
      if (nextOffset === prev.offset) return prev;
      return { ...prev, offset: nextOffset };
    });
  }, []);

  const canMovePrev =
    slideState.step > 0 && slideState.maxOffset - slideState.offset > 0.5;

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${slideState.offset}px)` }),
    [slideState.offset]
  );

  // 카테고리 클릭 시
  const onCategoryClick = (cateValue) => {
    if (cateValue !== "전체") {
      navigate(`/list?cate=${encodeURIComponent(cateValue)}`);
    } else {
      navigate(`/list`);
    }
  };
  // 이미지 카드 클릭 시
  const onImgCardClick = (titleValue) => {
    navigate(`/list?title=${encodeURIComponent(titleValue)}`);
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
            <MainSearch />
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
            //  TODO : 슬라이드 구현 필요
            // 1. arrowPrev를 누르면 왼쪽으로만 이동하는 슬라이드 구현이 필요
            // 고민 포인트 : CategoryList는 fetch를 통한 렌더링이므로, 슬라이드 라이브러리 적용이 어려울 수 있음, 라이브러리 없이 구현해보고 싶음
            <>
              {/* arrowPrev */}
              <div
                className={`arrowPrev${canMovePrev ? "" : " disabled"}`}
                role="button"
                tabIndex={canMovePrev ? 0 : -1}
                aria-label="이전 카드 보기"
                aria-disabled={!canMovePrev}
                onClick={canMovePrev ? handlePrevClick : undefined}
                onKeyDown={(event) => {
                  if (!canMovePrev) return;
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
