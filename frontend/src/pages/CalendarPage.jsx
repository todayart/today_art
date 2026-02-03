// src/pages/CalendarPage.jsx
// 캘린더 페이지 메인 컴포넌트

import { useState } from "react";

// 뷰
import CalendarDesktopView from "components/main/calendar/CalendarDesktopView";
import CalendarMobileView from "components/main/calendar/CalendarMobileView";

// 유틸
import { getCurrentMonth, getMonths } from "utils/calendar";

// 훅
import useMobile from "hooks/useMobile";
import useCalendarData from "hooks/useCalendarData";

/**
 * * Api에 필요한 id 규칙
 *  1m-start, 1m-end, 2m-start, 2m-end ... 12m-start, 12m-end로 설정되어 있음
 */

export default function CalendarPage() {
  // * 데스크톱
  // hover 활성화 상태
  const [activeMonth, setActiveMonth] = useState(null);

  // * 모바일
  // 화면에 띄울 월(인덱스)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // * 공통
  // 월 배열
  const months = getMonths();
  // 현재 디바이스가 모바일인지 여부
  const isMobile = useMobile();
  // 월 상태 범위 제한 함수
  const clampMonth = (month) => Math.min(12, Math.max(1, month));

  // 캘린더 전시 데이터 가져오기 커스텀 훅
  const { data: exhibitions, loading, error, refetch } = useCalendarData();

  return (
    <div className="calendarPage">
      {isMobile ? (
        <CalendarMobileView
          exhibitions={exhibitions}
          monthsArray={months}
          selectedMonth={selectedMonth}
          onChangeMonth={(next) => setSelectedMonth(clampMonth(next))}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      ) : (
        <CalendarDesktopView
          exhibitions={exhibitions}
          monthsArray={months}
          activeMonth={activeMonth}
          onHoverMonth={setActiveMonth}
          onLeaveMonth={() => setActiveMonth(null)}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      )}
    </div>
  );
}
