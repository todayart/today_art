// src/pages/ListPage.jsx
import { useEffect, useState } from "react";
import { useFilterParams } from "hooks/useFilterParams";
import { useSortParam } from "hooks/useSortParams";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useInfiniteEntries } from "hooks/useInfiniteEntries"; // ★ 새 훅
import { useCachedEntry } from "hooks/useCachedEntry";

import FilterUiHeader from "components/header/FilterUiHeader";
import SortSelect from "components/main/list/SortSelect";
import ImgCard from "components/main/ImgCard";
import DetailCard from "components/main/detail/DetailCard";

export default function ListPage() {
  /* 1. 필터‧정렬 파라미터 ------------------------------------ */
  const [searchParams, updateFilterParams] = useFilterParams();
  const { term, startDate, endDate, cate, title } = useFilterParamsValues();
  const [searchTerm, setSearchTerm] = useState(term);
  const [sortOption, onSortChange] = useSortParam();

  /* 2. 상세 vs 목록 ----------------------------------------- */
  const isDetail = Boolean(title);
  const eventData = useCachedEntry(title);

  /* 3. 무한 스크롤 ------------------------------------------ */

  const {
    items: entries,
    loading,
    error,
    hasMore,
    sentRef,
  } = useInfiniteEntries(
    Object.fromEntries(searchParams), // 필터 파라미터
    { pageSize: 8, autoScroll: true }
  );
  /* 4. 핸들러 ------------------------------------------------ */
  const onSearch = () => updateFilterParams({ term: searchTerm, title: null });
  const onCateChange = (c) =>
    updateFilterParams({ cate: c && c !== "전체" ? c : "" });
  const onDateChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };
  const onCardClick = (t) => updateFilterParams({ title: t });
  const onBack = () => updateFilterParams({ title: null });

  useEffect(() => {
    console.log(
      "mounted searchParams object:",
      Object.fromEntries(searchParams)
    );
  }, [searchParams]);

  /* 5. 렌더 -------------------------------------------------- */
  return (
    <>
      <FilterUiHeader
        term={searchTerm}
        setTerm={setSearchTerm}
        onSearch={onSearch}
        cate={cate}
        onCategoryChange={onCateChange}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={onDateChange}
      />

      {isDetail ? (
        eventData ? (
          <main className="contentsWrapper">
            <DetailCard
              title={eventData.TITLE}
              imageUrl={eventData.IMAGE_URL}
              handleGoBack={onBack}
              details={[
                { label: "카테고리", value: eventData["CATEGORY_NM"] },
                {
                  label: "전시기간",
                  value: `${eventData["BEGIN_DE"]} ~ ${eventData["END_DE"]}`,
                },
                { label: "이벤트 시간", value: eventData["EVENT_TM_INFO"] },
                { label: "참가비", value: eventData["PARTCPT_EXPN_INFO"] },
                { label: "주최 기관", value: eventData["HOST_INST_NM"] },
                { label: "전화번호", value: eventData["TELNO_INFO"] },
                { label: "홈페이지", value: eventData["HMPG_URL"] },
              ]}
            />
          </main>
        ) : (
          <p>상세 데이터를 불러오는 중...</p>
        )
      ) : (
        <main className="contentsWrapper">
          <div className="sortSelectArea">
            <SortSelect sortOption={sortOption} onSortChange={onSortChange} />
          </div>

          <div className="listContainer">
            {entries.map((e, i) => (
              <ImgCard
                key={e.URL ?? i}
                title={e.TITLE}
                address={e.HOST_INST_NM}
                sPeriod={e.BEGIN_DE}
                ePeriod={e.END_DE}
                imageUrl={e.IMAGE_URL}
                onClick={() => onCardClick(e.TITLE)}
              />
            ))}
            <div id="sentinel" ref={sentRef} /> {/* Intersection 대상 */}
          </div>

          {loading && <p>로딩 중...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!hasMore && <p>모든 항목을 불러왔습니다.</p>}
        </main>
      )}
    </>
  );
}
