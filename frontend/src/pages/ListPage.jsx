// pages/ListPage.jsx
import { useState } from "react";

import { useFilterParams } from "hooks/useFilterParams";
import { useSortParam } from "hooks/useSortParams";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useCachedEntries } from "hooks/useCachedEntries";
import { useCachedEntry } from "hooks/useCachedEntry";

import FilterUiHeader from "components/header/FilterUiHeader";
import SortSelect from "components/main/list/SortSelect";
import ImgCard from "components/main/ImgCard";
import DetailCard from "components/main/detail/DetailCard";

export default function ListPage() {
  const { term, startDate, endDate, cate, title, searchParams } =
    useFilterParamsValues();

  const [searchTerm, setSearchTerm] = useState(term);
  const [_, updateFilterParams] = useFilterParams();
  const [sortOption, onSortChange] = useSortParam();

  // 캐시된 엔트리 목록 가져오기
  const { entries, loading, error } = useCachedEntries(searchParams);
  // 상세 데이터
  const eventData = useCachedEntry(title);

  // 상세 조건
  const isDetail = Boolean(title);

  // * 핸들러 함수
  const onSearchClick = () => {
    updateFilterParams({ term: searchTerm, title: null }); // 검색 시 상세 보기 초기화
  };

  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };

  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
  };

  // 카드 클릭 시 title 파라미터로 상세 페이지로 이동
  const onCardClick = (title) => {
    updateFilterParams({ title });
  };

  // 뒤로가기 버튼 클릭 시 title 파라미터 제거
  const onBackToList = () => {
    updateFilterParams({ title: null });
  };

  if (error) {
    return <p>에러가 발생했습니다: {error.message}</p>;
  }

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
      {/* 상세 페이지일 때 DetailCard 컴포넌트 사용, 아니면 ImgCard 목록 */}
      {isDetail ? (
        eventData ? (
          <main className="contentsWrapper">
            <DetailCard
              title={eventData.TITLE}
              imageUrl={eventData.IMAGE_URL}
              handleGoBack={onBackToList}
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
      ) : // 로딩 상태
      loading ? (
        <p>로딩 중...</p>
      ) : (
        // 엔트리 목록
        <main className="contentsWrapper">
          <div className="sortSelectArea">
            <SortSelect sortOption={sortOption} onSortChange={onSortChange} />
          </div>
          {entries.length === 0 ? (
            <p>결과가 없습니다.</p>
          ) : (
            <div className="listContainer">
              {entries.slice(0, 8).map((entry, index) => (
                <ImgCard
                  key={entry.URL || index}
                  title={entry.TITLE}
                  address={entry.HOST_INST_NM}
                  sPeriod={entry.BEGIN_DE}
                  ePeriod={entry.END_DE}
                  imageUrl={entry.IMAGE_URL}
                  onClick={() => onCardClick(entry.TITLE)}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </>
  );
}
