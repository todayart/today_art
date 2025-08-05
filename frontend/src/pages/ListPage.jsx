import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EntryContext } from "contexts/EntryContext";
import { fetchData } from "utils/fetchData";

import CommonHeader from "components/header/CommonHeader";
import CommonSelect from "components/Input/CommonSelect";
import ImgCard from "components/main/ImgCard";

import { SORT_MAP } from "contents/sortOption";
import { REVERSE_SORT_MAP } from "contents/sortOption";
import { updateParams } from "utils/updateParams";

export default function ListPage() {
  const entries = useContext(EntryContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [fetched, setFetched] = useState([]); // 필터된 결과
  const [loading, setLoading] = useState(false);

  // 정렬 상태 관리 , UI 초기 선택값으로 매핑
  const sorUrlParam = searchParams.get("sort");
  const initialOption = REVERSE_SORT_MAP[sorUrlParam] || "정렬순";
  const [sortOption, setSortOption] = useState(initialOption);

  // url 파라미터 가져오기
  const term = searchParams.get("term");
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const cate = searchParams.get("cate") || "";

  const hasFilter = Boolean(
    term || startDate || endDate || cate || SORT_MAP[sortOption]
  );
  const displayed = hasFilter ? fetched : entries;

  const onSortChange = (newSort) => {
    const sortValue = SORT_MAP[newSort] || "";
    setSortOption(newSort);
    updateParams({ sort: sortValue }, searchParams, setSearchParams);
  };

  // 컴포넌트가 마운트되거나 URL 파라미터가 변경될 때마다 데이터 fetch
  useEffect(() => {
    console.log("searchParams:", searchParams);
    // URL에 term/startDate/endDate/category/sort 중 하나라도 있으면 fetch
    if (term || startDate || endDate || cate || SORT_MAP[sortOption]) {
      const qs = searchParams.toString();
      setLoading(true);
      fetchData(`http://localhost:8000/api/entries/?${qs}`)
        .then((data) => {
          setFetched(data);
          console.log(`http://localhost:8000/api/entries/?${qs}`);
          console.log("Fetched data:", data);
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  return (
    <>
      {/* 커먼 헤더 위치 */}
      <CommonHeader
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <main className="contentsWrapper">
          <div className="sortSelectArea">
            {/* TODO : 현재 운영 중인 항목 필터하는 CHECKOUT UI를 추가, active를 true/false로 보내면 된다. */}
            <CommonSelect
              labels={[
                "정렬순",
                "최신순",
                "임박순",
                "제목 오름차순",
                "제목 내림차순",
              ]}
              selected={sortOption || "정렬순"}
              id="sortSelect"
              selectStyle={{ width: "150px" }}
              onChange={onSortChange}
            />
          </div>
          {displayed.length > 0 ? (
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
          ) : (
            <p>결과값 없음</p>
          )}
        </main>
      )}
    </>
  );
}
