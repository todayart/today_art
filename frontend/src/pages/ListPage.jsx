import { useContext, useEffect } from "react";

import { EntryContext } from "contexts/EntryContext";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import PeriodInput from "components/Input/PeriodInput";
import SmallSearchInput from "components/Input/SmallSearchInput";
import ImgCard from "components/main/ImgCard";

export default function ListPage() {
  const entries = useContext(EntryContext);

  // 콘솔 로그로 entries 확인
  useEffect(() => {
    console.log("CategoryList Mounted");
  }, []);
  useEffect(() => {
    console.log("entries:", entries);
  }, [entries]);

  //TODO : PeriodInput에 사용될 OnRangeChange 함수를 생성해야함, 내용은 내용을 그대로 백앤드로 보내는 fetch함수이다.
  const handleRangeChange = async (payload) => {
    const { startDate, endDate } = payload;

    // 테스트용 콘솔로그
    console.log("payload:", payload);
    console.log("Selected dates:", { startDate, endDate });
    console.log(typeof startDate, typeof endDate);

    // 재사용 가능한 fetch 함수
    const fetchData = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Fetch error:", response.statusText);
        // throw new Error("Network response was not ok");
      }
      return response.json();
    };

    try {
      // 날짜가 모두 선택된 경우
      if (startDate !== null && endDate !== null) {
        const url = `http://localhost:8000/api/entries/?startDate=${startDate}&endDate=${endDate}`;
        console.log("Fetching data with range:", url);
        const data = await fetchData(url);
        // TODO: 리렌더링을 위한 상태 업데이트 로직 추가 (예, setEntries(data))
        console.log("Fetched data st,end:", data);
      } else if (startDate || endDate) {
        console.log("elseIf 2 : Fetching single data :", startDate, endDate);
        const queryParam = startDate
          ? `startDate=${startDate}`
          : `endDate=${endDate}`;
        const url = `http://localhost:8000/api/entries/?${queryParam}`;
        console.log("single date url:", url);
        const data = await fetchData(url);
        // TODO: 리렌더링을 위한 상태 업데이트 로직 추가 (예, setEntries(data))
        console.log("Fetched data:", data);
      } else {
        console.log("else 발동");
      }
    } catch (error) {
      console.error("Fetching error:", error);
    }
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
          {entries.slice(0, 8).map((entry, index) => (
            <ImgCard
              key={index}
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
