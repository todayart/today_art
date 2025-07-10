import CommonHeader from "../header/CommonHeader";
import CommonSelect from "../Input/CommonSelect";
import SmallSearchInput from "../Input/SmallSearchInput";
import "../../styles/main/main.css";
import PeriodInput from "../Input/PeriodInput";
import ImgCard from "../main/ImgCard";
import ListCover from "../../assets/main/listCover.png";

export default function ListPage() {
  //TODO : PeriodInput에 사용될 OnRangeChange 함수를 생성해야함, 내용은 내용을 그대로 백앤드로 보내는 fetch함수이다.

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
      <main className="listContentsWrapper testLine">
        <div
          className="sortSelectArea"
          style={{
            width: "100%",
            height: "64px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          <CommonSelect
            labels={["정렬순", "최신순", "오래된순"]}
            selected="정렬순"
            id="sortSelect"
            selectStyle={{ width: "150px" }}
          />
        </div>
        <div className="listContainer" style={{ padding: "0 200px" }}>
          {/* TODO : OPEN API 작동 후 리스트 아이템들을 렌더링 필요 데이터는 URL, TITLE, ADDRESS, PERIOD 등이 있다.*/}
          <ImgCard
            title="아트페어 2025"
            address="서울시 강남구"
            period="2025-07-01 ~ 2025-07-12"
            imageUrl={ListCover}
          />
          <ImgCard
            title="아트페어 2025"
            address="서울시 강남구"
            period="2025-07-01 ~ 2025-07-12"
            imageUrl={ListCover}
          />
          <ImgCard
            title="아트페어 2025"
            address="서울시 강남구"
            period="2025-07-01 ~ 2025-07-12"
            imageUrl={ListCover}
          />
          <ImgCard
            title="아트페어 2025"
            address="서울시 강남구"
            period="2025-07-01 ~ 2025-07-12"
            imageUrl={ListCover}
          />
          <ImgCard
            title="아트페어 2025"
            address="서울시 강남구"
            period="2025-07-01 ~ 2025-07-12"
            imageUrl={ListCover}
          />
        </div>
      </main>
    </>
  );
}
