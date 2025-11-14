// src/pages/ListPage.jsx

import { useState } from "react";
import { useFilterParams } from "hooks/useFilterParams";
import { useSortParam } from "hooks/useSortParams";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useCachedEntryByTitle } from "hooks/useCachedEntryByTitle";
import { useInfiniteEntries } from "hooks/useInfiniteEntries";

import FilterUiHeader from "components/header/FilterUiHeader";
import SortSelect from "components/main/list/SortSelect";
import ImgCard from "components/main/ImgCard";
import DetailCard from "components/main/detail/DetailCard";

export default function ListPage() {
  const { term, startDate, endDate, cate, title, searchParams } =
    useFilterParamsValues();

  const [searchTerm, setSearchTerm] = useState(term);
  // _ 대신 공백을 사용, lint 에러 방지
  const [, updateFilterParams] = useFilterParams();
  const [sortOption, onSortChange] = useSortParam();

  // 리스트 데이터: 무한 스크롤 훅
  const { items, hasMore, loading, error, sentinelRef } = useInfiniteEntries({
    qs: searchParams,
    pageSize: 8,
  });

  // 상세 데이터
  const eventData = useCachedEntryByTitle(title);
  const isDetail = Boolean(title);

  // * 핸들러
  const onSearchClick = () => {
    updateFilterParams({ term: searchTerm, title: null });
  };
  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };
  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
  };
  const onCardClick = (title) => {
    updateFilterParams({ title });
  };
  const onBackToList = () => {
    updateFilterParams({ title: null });
  };

  if (error) return <p>에러: {error.message}</p>;

  return (
    <>
      <FilterUiHeader
        term={searchTerm}
        setTerm={setSearchTerm}
        onSearch={onSearchClick}
        cate={cate}
        onCategoryChange={onCategoryChange}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={onDateRangeChange}
      />

      {isDetail ? (
        eventData ? (
          <main className="contentsWrapper">
            <DetailCard
              title={eventData.TITLE}
              imageUrl={eventData.IMAGE_URL}
              handleGoBack={onBackToList}
              details={[
                { label: "카테고리", value: eventData.CATEGORY_NM },
                {
                  label: "전시기간",
                  value: `${eventData.BEGIN_DE} ~ ${eventData.END_DE}`,
                },
                {
                  label: "이벤트 시간",
                  value: eventData.EVENT_TM_INFO,
                },
                {
                  label: "참가비",
                  value: eventData.PARTCPT_EXPN_INFO,
                },
                {
                  label: "주최 기관",
                  value: eventData.HOST_INST_NM,
                },
                { label: "전화번호", value: eventData.TELNO_INFO },
                { label: "홈페이지", value: eventData.HMPG_URL },
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
            {items.length === 0 && loading ? (
              <p>로딩 중...</p>
            ) : items.length === 0 ? (
              <p>결과가 없습니다.</p>
            ) : (
              items.map((entry, idx) => (
                <ImgCard
                  key={entry.URL || entry.TITLE || idx}
                  title={entry.TITLE}
                  address={entry.HOST_INST_NM}
                  sPeriod={entry.BEGIN_DE}
                  ePeriod={entry.END_DE}
                  imageUrl={entry.IMAGE_URL}
                  onClick={() => onCardClick(entry.TITLE)}
                />
              ))
            )}
          </div>

          {/* 스크롤 센티널 */}
          <div ref={sentinelRef} style={{ height: 1 }} />

          {/* 상태 표시 */}
          {loading && <p>로딩 중...</p>}
          {!hasMore && items.length > 0 && <p>마지막 페이지입니다.</p>}
        </main>
      )}
    </>
  );
}
