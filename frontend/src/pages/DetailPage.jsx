// import "styles/main/main.css";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import SmallSearchInput from "components/Input/SmallSearchInput";
import PeriodInput from "components/Input/PeriodInput";
import DetailCard from "components/main/detail/DetailCard";

import ListCover from "assets/main/listCover.png";
import { useParams } from "react-router-dom";

export default function DetailPage() {
  // URL 파라미터에서 title을 가져옵니다.
  const { title } = useParams();
  // decodeURIComponent로 원래 문자열 복원
  const decodedTitle = decodeURIComponent(title);

  const handleRangeChange = ({ startDate, endDate }) => {
    console.log("Selected dates:", { startDate, endDate });
  };

  // ? title로 백엔드의 엔드포인트로 보내 정보를 따온다. 즉, 백앤드 서버에서 모든 데이터를 가지고 있어야만 한다.
  // ? 이것이 맞을까? 고민포인트이다.

  // ? 만약 프론트엔드에서 브라우저에 데이터를 캐시에 저장시킨 후 이걸 활용하는 것이 유리할까?

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
          title={decodedTitle}
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
