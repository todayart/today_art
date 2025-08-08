import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import SmallSearchInput from "components/Input/SmallSearchInput";
import PeriodInput from "components/Input/PeriodInput";

import urlMeta from "contents/urlMeta.json";

export default function FilterUiHeader({
  term,
  setTerm,
  onSearch,
  cate,
  onCategoryChange,
  startDate,
  endDate,
  onDateRangeChange,
}) {
  return (
    <CommonHeader>
      <CommonSelect
        labelContents="카테고리"
        labels={urlMeta.headerLinks[1].category}
        selected={cate || "전체"}
        id="cateSelect"
        selectStyle={{ width: "220px" }}
        onChange={onCategoryChange}
      />
      <PeriodInput
        sValue={startDate}
        eValue={endDate}
        onRangeChange={onDateRangeChange}
      />
      <SmallSearchInput
        value={term}
        onChange={setTerm}
        onSearch={onSearch}
        placeholder="검색어를 입력하세요"
      />
    </CommonHeader>
  );
}
