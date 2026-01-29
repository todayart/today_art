// src/components/main/calendar/CalendarHeader.jsx
// 캘린더 헤더 컴포넌트

import Logoimg from "components/main/Logoimg";
import Header from "components/header/Header";
import MonthCell from "components/main/calendar/MonthCell";

import useMobile from "hooks/useMobile";
import { getCurrentMonth, getCurrentYear } from "utils/calendar";

export default function CalendarHeader({
  activeMonth = null,
  selectedMonth = 1,
  onChangeMonth,
  monthsArray = [],
  isDark = false,
  currentTheme,
  onThemeChange,
}) {
  const isMobile = useMobile();

  // * 공통
  // 활성화 class를 추가할 월 결정
  // 1. 모바일 - 현재 월을 selectedMonth로 고정
  // 2. 데스크톱 - hover된 월을 activeMonth로 설정
  const currentActiveMonth = isMobile ? selectedMonth : activeMonth;

  // offset 계산
  // (monthCell은 첫 번째 칸이 스페이서이므로 selectedMonth와 동일)
  const offset = selectedMonth * 100;

  // 로고 파트 현재 연도 계산
  const currentYear = getCurrentYear();

  // * 모바일
  const currentMonth = getCurrentMonth();

  return (
    <section className="commonHeader">
      <Header currentTheme={currentTheme} onThemeChange={onThemeChange} />
      {/* 로고 파트 */}
      <div
        className={
          isMobile ? "calendarLogo calendarLogo--mobile" : "calendarLogo"
        }
      >
        <Logoimg className="calendarLogoImg" isDark={isDark} />
        <span className="currentYear">{currentYear}</span>
      </div>
      <div
        className="selectBox"
        style={isMobile ? { transform: `translateX(-${offset}vw)` } : {}}
      >
        {/* 월 표시 그리드 파트 */}
        <section className="monthGrid">
          <div className="monthCell monthCell--spacer" aria-hidden="true" />
          {monthsArray.map(({ month, name }) => (
            <MonthCell
              key={month}
              month={month}
              name={name}
              isActive={month === currentActiveMonth}
              isCurrent={isMobile && month === currentMonth}
              isMobile={isMobile}
              isSelected={isMobile && month === selectedMonth}
              onChangeMonth={onChangeMonth}
            />
          ))}
        </section>
      </div>
    </section>
  );
}
