import CalendarHeader from "components/main/calendar/CalendarHeader";
import CalendarFixedCell from "components/main/calendar/CalendarFixedCell";
import { useEffect, useState } from "react";

import { fetchData } from "utils/fetchData";
/**
 * 이 컴포넌트는 calendar 페이지의 메인 컴포넌트입니다.
 *
 * * Api에 필요한 id 규칙
 *  1m-start, 1m-end, 2m-start, 2m-end ... 12m-start, 12m-end로 설정되어 있음
 */
export default function CalendarPage() {
  const [exhibitions, setExhibitions] = useState({});
  // 현재 활성화된 월을 상태로 관리
  const [activeMonth, setActiveMonth] = useState(null);
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
    <>
      <CalendarHeader activeMonth={activeMonth} />
      {/* 메인 캘린더 영역 ( 13열 x 2열 ) */}
      <CalendarFixedCell
        exhibitions={exhibitions}
        onHoverMonth={setActiveMonth}
        onLeaveMonth={() => setActiveMonth(null)}
      />
    </>
  );
}
