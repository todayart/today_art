import Logoimg from "components/main/Logoimg";
import Header from "./Header";
import { updateParams } from "utils/updateParams";
import { useState } from "react";
import SmallSearchInput from "../Input/SmallSearchInput";
import PeriodInput from "../Input/PeriodInput";
import CommonSelect from "../Input/CommonSelect";

export default function CommonHeader({ searchParams, setSearchParams }) {
  // 상태 관리
  const [term, setTerm] = useState(searchParams.get("term") || "");
  // url 파라미터 가져오기
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const cate = searchParams.get("cate") || "";

  // 검색 버튼 클릭 시 URL 갱신 및 리스트 페이지로 이동 함수
  const onSearchClick = () => {
    updateParams({ term }, searchParams, setSearchParams);
    window.location.href = `/list/?${searchParams.toString()}`;
  };

  // 날짜·분류 변경 시에도 URL 갱신
  const onDateRangeChange = ({ startDate, endDate }) => {
    updateParams({ startDate, endDate }, searchParams, setSearchParams);
    window.location.href = `/list/?${searchParams.toString()}`;
  };

  // 카테고리 변경 시에도 URL 갱신
  const onCategoryChange = (newCat) => {
    updateParams(
      { cate: newCat && newCat !== "전체" ? newCat : "" },
      searchParams,
      setSearchParams
    );
    window.location.href = `/list/?${searchParams.toString()}`;
  };
  return (
    <div className="commonHeader">
      <Header />
      <div className="selectBox flexCenter">
        <Logoimg className="commonHeaderLogoImg" />
        <CommonSelect
          labelContents="카테고리"
          labels={["전체", "공연", "행사", "교육", "전시"]}
          selected={cate || "전체"}
          id="cateSelect"
          selectStyle={{ width: "220px" }}
          onChange={onCategoryChange}
        />

        <SmallSearchInput
          value={term}
          onChange={setTerm}
          onSearch={onSearchClick}
          placeholder="검색어를 입력하세요"
        />
        {/* 기간 선택 */}
        <PeriodInput
          sValue={startDate}
          eValue={endDate}
          onRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
}
