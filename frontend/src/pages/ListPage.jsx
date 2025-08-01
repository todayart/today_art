import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EntryContext } from "contexts/EntryContext";
import { fetchData } from "utils/fetchData";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import PeriodInput from "components/Input/PeriodInput";
import SmallSearchInput from "components/Input/SmallSearchInput";
import ImgCard from "components/main/ImgCard";

export default function ListPage() {
  const entries = useContext(EntryContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [fetched, setFetched] = useState([]); // 필터된 결과
  const [loading, setLoading] = useState(false);

  // 검색어 상태
  const [term, setTerm] = useState(searchParams.get("term") || "");
  // URL 파라미터 꺼내기
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const cate = searchParams.get("cate") || "";

  const displayed = term || startDate || endDate || cate ? fetched : entries;

  // 검색 버튼 클릭 시 URL 갱신 함수
  const onSearchClick = () => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("term", term);
    else params.delete("term");
    params.set("pIndex", "1");
    setSearchParams(params);
  };

  useEffect(() => {
    console.log("searchParams:", searchParams);
    // URL에 term/startDate/endDate/category 중 하나라도 있으면 fetch
    if (term || startDate || endDate || cate) {
      const qs = searchParams.toString();
      setLoading(true);
      fetchData(`http://localhost:8000/api/entries/?${qs}`)
        .then((data) => {
          setFetched(data);
          console.log("Fetched data:", data);
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  return (
    <>
      <CommonHeader>
        <CommonSelect
          labelContents="카테고리"
          labels={["전체", "공연", "행사", "교육", "전시"]}
          selected={cate || "전체"}
          id="cateSelect"
          selectStyle={{ width: "220px" }}
        />

        <SmallSearchInput
          value={term}
          onChange={setTerm}
          onSearch={onSearchClick}
          placeholder="검색어를 입력하세요"
        />
        {/* 기간 선택 */}
        <PeriodInput onRangeChange={() => {}} />
      </CommonHeader>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
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
            {displayed.slice(0, 8).map((entry, index) => (
              <ImgCard
                key={index || entry.URL}
                title={entry.TITLE}
                address={entry.HOST_INST_NM}
                sPeriod={entry.BEGIN_DE}
                ePeriod={entry.END_DE}
                imageUrl={entry.IMAGE_URL}
              />
            ))}
          </div>
        </main>
      )}
    </>
  );
}
