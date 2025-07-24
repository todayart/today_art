import { useContext, useEffect } from "react";

import { EntryContext } from "contexts/EntryContext";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import PeriodInput from "components/Input/PeriodInput";
import SmallSearchInput from "components/Input/SmallSearchInput";
import ImgCard from "components/main/ImgCard";

export default function ListPage() {
  const entries = useContext(EntryContext);
  useEffect(() => {
    console.log("CategoryList Mounted");
  }, []);
  useEffect(() => {
    console.log("entries:", entries);
  }, [entries]);

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
      <main className="contentsWrapper">
        <div className="sortSelectArea">
          <CommonSelect
            labels={["정렬순", "최신순", "오래된순"]}
            selected="정렬순"
            id="sortSelect"
            selectStyle={{ width: "150px" }}
          />
        </div>
        <div className="listContainer">
          {/* list는 imgcard 컴포넌트가 8개가 우선적으로 나온다. */}
          {entries.slice(0, 8).map((entry) => (
            <ImgCard
              // key={entry.}
              title={entry.TITLE}
              address={entry.HOST_INST_NM}
              sPeriod={entry.BEGIN_DE}
              ePeriod={entry.END_DE}
              imageUrl={entry.IMAGE_URL}
            />
          ))}
        </div>
      </main>
    </>
  );
}
