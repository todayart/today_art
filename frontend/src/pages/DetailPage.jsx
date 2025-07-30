import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import SmallSearchInput from "components/Input/SmallSearchInput";
import PeriodInput from "components/Input/PeriodInput";
import DetailCard from "components/main/detail/DetailCard";

// console.log("DetailPage.jsx loaded");
export default function DetailPage() {
  // console.log("DetailPage mounted");
  // URL 파라미터에서 title을 가져옵니다.
  const { title } = useParams();
  // decodeURIComponent로 원래 문자열 복원
  const decodedTitle = decodeURIComponent(title);
  // console.log("Decoded title:", decodedTitle);

  const [eventData, setEventData] = useState(null);

  const handleRangeChange = ({ startDate, endDate }) => {
    console.log("Selected dates:", { startDate, endDate });
  };

  // ? 만약 프론트엔드에서 브라우저에 데이터를 캐시에 저장시킨 후 이걸 활용하는 것이 유리할까?

  // * 한번만 api를 요구하는 데에서 유리하다고 생각되었고, 캐시를 활용하는 방면으로 활용됐다.

  // 페이지가 마운트될 때마다 API를 호출하여 데이터를 가져옵니다.
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
  }, []);

  // useEffect(
  //   function eventDataConsole() {
  //     console.log("Event data updated:", eventData);
  //   },
  //   [eventData]
  // );

  if (!eventData) {
    return <div>Loading...</div>;
  }

  // 매핑 전시 데이터
  // 하이픈이 있으므로 대괄호를 써야 한다.
  const details = [
    {
      label: "전시기간",
      value: `${eventData["BEGIN_DE"]} ~ ${eventData["END_DE"]}`,
    },
    { label: "카테고리", value: eventData["CATEGORY_NM"] },
    { label: "이벤트 시간", value: eventData["EVENT_TM_INFO"] },
    { label: "홈페이지", value: eventData["HMPG_URL"] },
    { label: "주최 기관", value: eventData["HOST_INST_NM"] },
    { label: "기관명", value: eventData["INST_NM"] },
    { label: "참가비", value: eventData["PARTCPT_EXPN_INFO"] },
    { label: "전화번호", value: eventData["TELNO_INFO"] },
    { label: "등록일", value: eventData["WRITNG_DE"] },
  ];

  return (
    <>
      <CommonHeader>
        <CommonSelect
          labelContents="전시장소"
          labels={["전체", "서울", "부산", "대구"]}
          selected="전체"
          id="exhibitionLocationSelect"
          selectStyle={{ width: "220px" }}
        />
        <SmallSearchInput />
        <PeriodInput onRangeChange={handleRangeChange} />
      </CommonHeader>
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
