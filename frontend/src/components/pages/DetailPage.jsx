import "../../styles/main/main.css";

import CommonHeader from "../header/CommonHeader";
import CommonSelect from "../Input/CommonSelect";
import SmallSearchInput from "../Input/SmallSearchInput";
import PeriodInput from "../Input/PeriodInput";
import DetailCard from "../main/detail/DetailCard";

import ListCover from "../../assets/main/listCover.png";

export default function DetailPage() {
  const handleRangeChange = ({ startDate, endDate }) => {
    console.log("Selected dates:", { startDate, endDate });
  };

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
          title="지역미술조명사업Ⅰ 《가고: 이동훈, 이남규, 이인영…zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz》"
          imageUrl={ListCover}
          details={[
            {
              label: "전시기간",
              value:
                "2024-03-19 ~ 2024-05-12 zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
            },
            {
              label: "부문",
              value:
                "회화, 도예, 조각, 아카이브 등 zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
            },
            {
              label: "출품작가",
              value:
                "이동훈, 이남규, 이인영, 임봉재, 이종수zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz ",
            },
            {
              label: "전시장소",
              value:
                "1전시실,2전시실,3전시실,4전시실zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
            },
          ]}
        />
      </main>
    </>
  );
}
