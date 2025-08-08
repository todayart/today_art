// pages/DetailPage.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCachedEntry } from "hooks/useCachedEntry";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useFilterParams } from "hooks/useFilterParams";

import DetailCard from "components/main/detail/DetailCard";
import FilterUiHeader from "components/header/FilterUiHeader";

export default function DetailPage() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const eventData = useCachedEntry(decodedTitle);

  const { term, startDate, endDate, cate } = useFilterParamsValues();
  const [_, updateFilterParams] = useFilterParams();
  const [searchTerm, setSearchTerm] = useState(term);

  const onSearchClick = () => {
    updateFilterParams({ term: searchTerm });
  };

  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };

  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
  };

  if (!eventData) return <div>Loading...</div>;

  const details = [
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
  ];

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
      <main className="contentsWrapper">
        <DetailCard
          title={eventData.TITLE}
          imageUrl={eventData.IMAGE_URL}
          details={details}
        />
      </main>
    </>
  );
}
