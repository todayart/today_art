import { useMemo, useState } from "react";

import { useFilterParams } from "hooks/useFilterParams";
import { useEntries } from "hooks/useEntries";

import FilterUiHeader from "components/header/FilterUiHeader";
import SortSelect from "components/main/list/SortSelect";
import ImgCard from "components/main/ImgCard";

import { useSortParam } from "hooks/useSortParams";

export default function ListPage() {
  // 필터 훅: searchParams & updateFilterParams
  const [searchParams, updateFilterParams] = useFilterParams();
  const [sortOption, onSortChange] = useSortParam();

  // 데이터 훅: entries(기본/필터된) & loading
  const { entries, loading, error } = useEntries();

  // 검색어 상태는 ListHeader에서 관리하기 위해 훅 밖으로 뺌
  const [term, setTerm] = useState(searchParams.get("term") || "");

  // 정렬 옵션

  //url 파라미터 가져오기
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const cate = searchParams.get("cate") || "";

  // ? 과한 투자는 아닐까?
  const displayed = useMemo(() => entries.slice(0, 8), [entries]);

  // 검색 버튼 클릭 시 URL 갱신 함수
  const onSearchClick = () => {
    updateFilterParams({ term });
  };

  // 날짜·분류 변경 시에도 URL 갱신
  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };

  // 카테고리 변경 시에도 URL 갱신
  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
  };

  // const onSortChange = (newSort) => {
  //   updateFilterParams({ sort: SORT_MAP[newSort] || "" });
  // };

  if (error) {
    return <p>에러가 발생했습니다: {error.message}</p>;
  }

  return (
    <>
      <FilterUiHeader
        term={term}
        setTerm={setTerm}
        onSearch={onSearchClick}
        cate={cate}
        onCategoryChange={onCategoryChange}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={onDateRangeChange}
      />

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <main className="contentsWrapper">
          <div className="sortSelectArea">
            {/* TODO : 현재 운영 중인 항목 필터하는 CHECKOUT UI를 추가, active를 true/false로 보내면 된다. */}
            <SortSelect sortOption={sortOption} onSortChange={onSortChange} />
          </div>
          {displayed.length === 0 ? (
            <p>결과가 없습니다.</p>
          ) : (
            <div className="listContainer">
              {displayed.map((entry, index) => (
                <ImgCard
                  key={index || entry.URL}
                  title={entry.TITLE}
                  address={entry.HOST_INST_NM}
                  sPeriod={entry.BEGIN_DE}
                  ePeriod={entry.END_DE}
                  imageUrl={entry.IMAGE_URL}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </>
  );
}
