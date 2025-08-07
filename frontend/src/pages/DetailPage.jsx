// pages/DetailPage.jsx
import { useParams } from "react-router-dom";
import { useCachedEntry } from "hooks/useCachedEntry";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import SmallSearchInput from "components/Input/SmallSearchInput";
import PeriodInput from "components/Input/PeriodInput";
import DetailCard from "components/main/detail/DetailCard";

export default function DetailPage() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const eventData = useCachedEntry(decodedTitle);

  const handleRangeChange = ({ startDate, endDate }) => {
    console.log("Selected dates:", { startDate, endDate });
  };

  if (!eventData) return <div>Loading...</div>;

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
