// pages/ListPage.jsx
import { useState } from "react";

import { useFilterParams } from "hooks/useFilterParams";
import { useSortParam } from "hooks/useSortParams";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useCachedEntries } from "hooks/useCachedEntries";

import FilterUiHeader from "components/header/FilterUiHeader";
import SortSelect from "components/main/list/SortSelect";
import ImgCard from "components/main/ImgCard";

export default function ListPage() {
  const { term, startDate, endDate, cate } = useFilterParamsValues();
  const [searchTerm, setSearchTerm] = useState(term);
  const [searchParams, updateFilterParams] = useFilterParams();
  const [sortOption, onSortChange] = useSortParam();

  const { entries, loading, error } = useCachedEntries(searchParams);

  const onSearchClick = () => {
    updateFilterParams({ term: searchTerm });
  };

  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };

  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
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

      {loading ? (
        <p>로딩 중...</p>
      ) : (
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
