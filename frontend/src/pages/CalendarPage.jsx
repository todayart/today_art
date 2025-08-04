import CalendarFixedCell from "components/calendar/CalendarFixedCell";
import CalendarHeader from "components/calendar/CalendarHeader";
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
  // useEffect나 커스텀훅으로 내용을 작성
  useEffect(() => {
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
      {/* 캘린더 헤더 영역 */}
      <CalendarHeader />
      {/* 메인 캘린더 영역 (grid layout으로 13열 x 2행) */}
      <CalendarFixedCell exhibitions={exhibitions} />
    </>
  );
}
