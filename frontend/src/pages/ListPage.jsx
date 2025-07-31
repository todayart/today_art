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

    // 날짜 유효성 검사 - 라이브러리에서 하므로 삭제 예정
    if (startDate && endDate && startDate > endDate) {
      console.error("시작 날짜가 종료 날짜보다 늦을 수 없습니다.");
      return;
    }

    // 테스트용 콘솔로그
    console.log("Selected dates:", { startDate, endDate });
    console.log(typeof startDate, typeof endDate);

    // 재사용 가능한 fetch 함수
    const fetchData = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Fetch error:", response.statusText);
      }
      return response.json();
    };

    try {
      // 날짜 범위가 있는 경우 기본 엔드포인트 요청
      if (startDate || endDate) {
        const url = `/api/entries?start=${startDate || ""}&end=${
          endDate || ""
        }`;
        const data = await fetchData(url);
        console.log("Fetched data:", data);
      } else {
        console.log("No date range selected, skipping fetch.");
      }

      // 별도 엔드포인트 요청 - endDate가 존재할 경우
      if (endDate) {
        const url = `http://localhost:8000/api/entrie/?&endDate=${endDate}`;
        const data = await fetchData(url);
        // TODO: 리렌더링을 위한 상태 업데이트 로직 추가 (예, setEntries(data))
        console.log("Fetched data:", data);
      }

      // 별도 엔드포인트 요청 - startDate가 존재할 경우
      if (startDate) {
        const url = `http://localhost:8000/api/entrie/?startDate=${startDate}`;
        const data = await fetchData(url);
        // TODO: 리렌더링을 위한 상태 업데이트 로직 추가 (예, setEntries(data))
        console.log("Fetched data:", data);
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
