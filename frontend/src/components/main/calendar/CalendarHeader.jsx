// src/components/main/calendar/CalendarHeader.jsx
// 캘린더 헤더 컴포넌트

import { useMemo } from "react";
import { format } from "date-fns";

import Logoimg from "components/main/Logoimg";
import Header from "components/header/Header";
import MonthCell from "components/main/calendar/MonthCell";

import useMobile from "hooks/useMobile";

export default function CalendarHeader({ activeMonth = null }) {
  const isMobile = useMobile();

  // 월 배열 생성
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, idx) => {
        const month = idx + 1;
        const date = new Date(2000, idx, 1);
        return { month, name: format(date, "MMMM") };
      }),
    []
  );

  // 로고 파트 현재 연도 계산
  const currentYear = useMemo(() => format(new Date(), "yyyy"), []);

  return (
    <section className="commonHeader">
      <Header />
      <div
        className="selectBox"
        // TODO-1 추후 ~월 다음 버튼을 통해 +100vw, -100vw로 이동하는 기능 추가 예정
        style={isMobile ? { transform: "translateX(-100vw)" } : {}}
      >
        {/* 로고 파트 */}
        <div
          className={
            isMobile ? "calendarLogo calendarLogo--mobile" : "calendarLogo"
          }
        >
          <Logoimg className="calendarLogoImg" />
          <span className="currentYear">{currentYear}</span>
        </div>
        {/* 월 표시 그리드 파트 */}
        <section className="monthGrid">
          <div className="monthCell monthCell--spacer" aria-hidden="true" />
          {months.map(({ month, name }) => (
            <MonthCell
              key={month}
              month={month}
              name={name}
              isActive={activeMonth === month}
              isMobile={isMobile}
            />
          ))}
        </section>
      </div>
    </section>
  );
}
