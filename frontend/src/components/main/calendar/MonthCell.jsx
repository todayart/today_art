// src/components/main/calendar/MonthCell.jsx
// 캘린더 헤더 컴포넌트 내부의 월 셀 컴포넌트

import SvgButton from "components/common/SvgButton";
import calendarArrow from "assets/common/mobile/calendarArrow.svg";

export default function MonthCell({
  month,
  name,
  isActive,
  isCurrent,
  isMobile,
  isSelected,
  onChangeMonth,
}) {
  const monthNumber = month.toString().padStart(2, "0");

  const canGoPrev = month > 1;
  const canGoNext = month < 12;

  return (
    <div
      className={`monthCell${isActive ? " is-active" : ""}${
        isCurrent ? " is-current" : ""
      }`}
      aria-current={isActive ? "date" : undefined}
    >
      {isMobile && isSelected && (
        <SvgButton
          icon={calendarArrow}
          className="monthNavButton"
          label={`${monthNumber}월 이전`}
          ariaLabel={`${monthNumber}월 이전`}
          onClick={() => onChangeMonth?.(month - 1)}
          disabled={!canGoPrev}
        />
      )}
      <div className="monthTitle">
        <span className="monthName">{name}</span>
        <span className="monthNumber">{monthNumber}</span>
      </div>
      {isMobile && isSelected && (
        <SvgButton
          icon={calendarArrow}
          className="monthNavButton reverse"
          label={`${monthNumber}월 다음`}
          ariaLabel={`${monthNumber}월 다음`}
          onClick={() => onChangeMonth?.(month + 1)}
          disabled={!canGoNext}
        />
      )}
    </div>
  );
}
