import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import DetailCard from "components/main/detail/DetailCard";
import CommonHeader from "components/header/CommonHeader";

export default function DetailPage() {
  // URL 파라미터에서 title을 가져옵니다.
  const { title } = useParams();
  // decodeURIComponent로 원래 문자열 복원
  const decodedTitle = decodeURIComponent(title);

  const [eventData, setEventData] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log("DetailPage mounted with title:", decodedTitle);
    fetch(
      `http://localhost:8000/api/entries/?term=${encodeURIComponent(
        decodedTitle
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setEventData(data[0]);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [decodedTitle]);

  if (!eventData) {
    return <div>Loading...</div>;
  }

  // 매핑 전시 데이터
  const details = [
    { label: "카테고리", value: eventData["CATEGORY_NM"] },
    {
      label: "전시기간",
      value: `${eventData["BEGIN_DE"]} ~ ${eventData["END_DE"]}`,
    },
    { label: "이벤트 시간", value: eventData["EVENT_TM_INFO"] },
    { label: "참가비", value: eventData["PARTCPT_EXPN_INFO"] },
    { label: "주최 기관", value: eventData["HOST_INST_NM"] },
    { label: "전화번호", value: eventData["TELNO_INFO"] },
    { label: "홈페이지", value: eventData["HMPG_URL"] },
  ];

  return (
    <>
      <CommonHeader
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <main className="contentsWrapper">
        <DetailCard
          title={eventData.TITLE}
          imageUrl={eventData.IMAGE_URL}
          details={details}
        />
      </main>
    </>
  );
}
