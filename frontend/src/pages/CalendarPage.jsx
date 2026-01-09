import CalendarHeader from "components/main/calendar/CalendarHeader";
import CalendarFixedCell from "components/main/calendar/CalendarFixedCell";
import CalendarMobileList from "components/main/calendar/CalendarMobileList";
import { useEffect, useMemo, useState } from "react";

import { fetchData } from "utils/fetchData";
import { getCurrentMonth, getMonths } from "utils/calendar";

import useMobile from "hooks/useMobile";
/**
 * 이 컴포넌트는 calendar 페이지의 메인 컴포넌트입니다.
 *
 * * Api에 필요한 id 규칙
 *  1m-start, 1m-end, 2m-start, 2m-end ... 12m-start, 12m-end로 설정되어 있음
 */
export default function CalendarPage() {
  const [exhibitions, setExhibitions] = useState({});
  // * 데스크톱
  // hover 활성화 상태
  const [activeMonth, setActiveMonth] = useState(null);

  // * 모바일
  // 화면에 띄울 월(인덱스)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // * 공통
  // 월 배열
  const months = useMemo(() => getMonths(), []);
  // 현재 디바이스가 모바일인지 여부
  const isMobile = useMobile();
  // 월 상태 범위 제한 함수
  const clampMonth = (month) => Math.min(12, Math.max(1, month));

  // useEffect나 커스텀훅으로 내용을 작성
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // 여기에 필요한 초기화 작업이나 API 호출 등을 작성할 수 있습니다.
    console.log("CalendarPage mounted");
    fetchData("http://localhost:8000/api/calendar/")
      .then((data) => {
        console.log("Fetched calendar data:", data);
        // 데이터를 상태에 저장하거나 필요한 작업을 수행합니다.
        setExhibitions(data);
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
      });
  }, []);

  return (
    <div className="calendarPage">
      <CalendarHeader
        activeMonth={activeMonth}
        selectedMonth={selectedMonth}
        onChangeMonth={(next) => setSelectedMonth(clampMonth(next))}
        monthsArray={months}
      />
      {/* 메인 캘린더 영역 ( 13열 x 2열 ) */}
      <section className="calendarBoard">
        {isMobile ? (
          <CalendarMobileList
            exhibitions={exhibitions}
            selectedMonth={selectedMonth}
            monthsArray={months}
          />
        ) : (
          <CalendarFixedCell
            exhibitions={exhibitions}
            onHoverMonth={setActiveMonth}
            onLeaveMonth={() => setActiveMonth(null)}
          />
        )}
      </section>
    </div>
  );
}
