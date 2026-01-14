import urlMeta from "contents/urlMeta.json";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import SmallSearchInput from "components/Input/SmallSearchInput";
import PeriodInput from "components/Input/PeriodInput";
import SvgButton from "components/common/SvgButton";

import CommonResetIcon from "assets/common/commonResetIcon.svg";
import MobileModalCloseIcon from "assets/main/nextBtn.svg";

export default function FilterUiHeader({
  term,
  setTerm,
  onSearch,
  cate,
  onCategoryChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
  // 모바일 전용
  onMobileModalShow,
  isMobile,
  isDetail,
}) {
  return (
    <CommonHeader
      className={isMobile && isDetail ? "commonHeader--mobileDetail" : ""}
      selectBoxClassName={isMobile && isDetail ? "selectBox--mobileDetail" : ""}
    >
      <CommonSelect
        labelContents="카테고리"
        labels={urlMeta.headerLinks[1].category}
        selected={cate || "전체"}
        id="cateSelect"
        onChange={onCategoryChange}
      />
      <PeriodInput
        sValue={startDate}
        eValue={endDate}
        onRangeChange={onDateRangeChange}
      />
      <div className="smallSearchInputWrapper">
        <SmallSearchInput
          value={term}
          onChange={setTerm}
          onSearch={onSearch}
          placeholder="검색어를 입력하세요"
        />
        <SvgButton
          icon={CommonResetIcon}
          label="필터 초기화 버튼"
          onClick={onReset}
        />
      </div>
      {isMobile && isDetail && (
        <SvgButton
          icon={MobileModalCloseIcon}
          className={"mobileModalCloseIcon--mobileDetail"}
          label="모바일 필터 모달 최소화 버튼"
          onClick={onMobileModalShow}
        />
      )}
    </CommonHeader>
  );
}
