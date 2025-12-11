// src/pages/ListPage.jsx

import { lazy, Suspense, useState } from "react";

import { ReactSVG } from "react-svg";
import mapIcon from "assets/common/mobile/map.svg";
import searchIcon from "assets/common/commonSearch.svg";

import { useFilterParams } from "hooks/useFilterParams";
import { useSortParam } from "hooks/useSortParams";
import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { useCachedEntryByTitle } from "hooks/useCachedEntryByTitle";
import { useInfiniteEntries } from "hooks/useInfiniteEntries";
import useMobile from "hooks/useMobile";

import { emitReset } from "stores/resetStore";

import FilterUiHeader from "components/header/FilterUiHeader";
import DetailCard from "components/main/detail/DetailCard";
import MobileDetailCard from "components/mobile/MobileDetailCard";
import FeedbackMessage from "components/common/FeedbackMessage";

const ListContent = lazy(() => import("components/main/list/ListContent"));

export default function ListPage() {
  const { term, startDate, endDate, cate, title, searchParams } =
    useFilterParamsValues();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState(term);
  // _ 대신 공백을 사용, lint 에러 방지
  const [, updateFilterParams] = useFilterParams();
  const [sortOption, onSortChange] = useSortParam();

  // 리스트 데이터: 무한 스크롤 훅
  const { items, loading, error, sentinelRef } = useInfiniteEntries({
    qs: searchParams,
    pageSize: 8,
  });

  // 상세 데이터
  const eventData = useCachedEntryByTitle(title);
  const isDetail = Boolean(title);

  // * 핸들러
  const onSearchClick = () => {
    updateFilterParams({ term: searchTerm, title: null });
  };
  const onDateRangeChange = ({ startDate, endDate }) => {
    updateFilterParams({ startDate, endDate });
  };
  const onCategoryChange = (newCat) => {
    updateFilterParams({ cate: newCat && newCat !== "전체" ? newCat : "" });
  };
  const onCardClick = (title) => {
    updateFilterParams({ title });
  };
  const onBackToList = () => {
    updateFilterParams({ title: null });
  };

  // 필터 초기화 핸들러
  const onReset = () => {
    setSearchTerm("");
    updateFilterParams({
      term: "",
      startDate: "",
      endDate: "",
      cate: "",
      title: null,
    });
    // 전역 리셋 이벤트 발신
    emitReset();
  };

  return (
    <>
      <FilterUiHeader
        term={searchTerm}
        setTerm={setSearchTerm}
        onSearch={onSearchClick}
        cate={cate}
        onCategoryChange={onCategoryChange}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={onDateRangeChange}
        onReset={onReset}
      />

      {isDetail ? (
        eventData ? (
          <main className="contentsWrapper">
            {!isMobile ? (
              // 데스크탑 Detail 페이지
              <DetailCard
                title={eventData.TITLE}
                imageUrl={eventData.IMAGE_URL}
                handleGoBack={onBackToList}
                details={[
                  { label: "카테고리", value: eventData.CATEGORY_NM },
                  {
                    label: "전시기간",
                    value: `${eventData.BEGIN_DE} ~ ${eventData.END_DE}`,
                  },
                  {
                    label: "이벤트 시간",
                    value: eventData.EVENT_TM_INFO,
                  },
                  {
                    label: "참가비",
                    value: eventData.PARTCPT_EXPN_INFO,
                  },
                  {
                    label: "주최 기관",
                    value: eventData.HOST_INST_NM,
                  },
                  { label: "전화번호", value: eventData.TELNO_INFO },
                  { label: "홈페이지", value: eventData.HMPG_URL },
                ]}
              />
            ) : (
              // 모바일 Detail 페이지
              <>
                <div className="mobileDetailCardBtnGroup">
                  <button type="button" className="mobileButton bg-tr">
                    <ReactSVG src={mapIcon} />
                  </button>
                  <button type="button" className="mobileButton bg-tr">
                    <ReactSVG src={searchIcon} />
                  </button>
                  <button
                    type="button"
                    className="backButton flexCenter commonBorder"
                    onClick={onBackToList}
                  >
                    이전으로
                  </button>
                </div>
                <MobileDetailCard
                  title={eventData.TITLE}
                  imageUrl={eventData.IMAGE_URL}
                  handleGoBack={onBackToList}
                  details={[
                    { label: "카테고리", value: eventData.CATEGORY_NM },
                    {
                      label: "전시기간",
                      value: `${eventData.BEGIN_DE} ~ ${eventData.END_DE}`,
                    },
                    {
                      label: "이벤트 시간",
                      value: eventData.EVENT_TM_INFO,
                    },
                    {
                      label: "참가비",
                      value: eventData.PARTCPT_EXPN_INFO,
                    },
                    {
                      label: "주최 기관",
                      value: eventData.HOST_INST_NM,
                    },
                    { label: "전화번호", value: eventData.TELNO_INFO },
                    { label: "홈페이지", value: eventData.HMPG_URL },
                  ]}
                />
              </>
            )}
          </main>
        ) : (
          <FeedbackMessage>상세 데이터를 불러오는 중...</FeedbackMessage>
        )
      ) : (
        <Suspense
          fallback={
            <main className="contentsWrapper">
              <FeedbackMessage>불러오는 중...</FeedbackMessage>
            </main>
          }
        >
          <ListContent
            sortOption={sortOption}
            onSortChange={onSortChange}
            items={items}
            loading={loading}
            error={error}
            sentinelRef={sentinelRef}
            onCardClick={onCardClick}
          />
        </Suspense>
      )}
    </>
  );
}
