// src/pages/ListPage.jsx

import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
import SvgButton from "components/common/SvgButton";

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

  // 모바일 필터 모달 관련
  const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
  const mobileFilterButtonRef = useRef(null);
  const mobileFilterCloseButtonRef = useRef(null);

  // 상세 데이터
  const eventData = useCachedEntryByTitle(title);
  const isDetail = Boolean(title);

  // eventData를 기반으로 상세 정보 매핑
  const eventDetails = eventData
    ? [
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
      ]
    : [];

  // * 핸들러 -------------
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
  const onReset = () => {
    setSearchTerm("");
    updateFilterParams({
      term: "",
      startDate: "",
      endDate: "",
      cate: "",
      title: null,
    });
    emitReset();
  };

  // 모바일 필터 모달 토글 (mobileModalCloseIcon--mobileDetail과 mobileFilterModalBtn에서 사용)
  const onToggleMobileFilterModal = () => {
    setIsMobileFilterModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isMobile || !isDetail) {
      setIsMobileFilterModalOpen(false);
    }
  }, [isMobile, isDetail]);

  useEffect(() => {
    if (!isMobile || !isDetail) return;
    if (isMobileFilterModalOpen) {
      mobileFilterCloseButtonRef.current?.focus();
    } else {
      mobileFilterButtonRef.current?.focus();
    }
  }, [isMobile, isDetail, isMobileFilterModalOpen]);

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
        // 모바일 디테일 전용
        isMobile={isMobile}
        isDetail={isDetail}
        onToggleMobileFilterModal={onToggleMobileFilterModal}
        isMobileFilterModalOpen={isMobileFilterModalOpen}
        closeButtonRef={mobileFilterCloseButtonRef}
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
                details={eventDetails}
              />
            ) : (
              // 모바일 Detail 페이지
              <>
                <div className="mobileDetailCardBtnGroup">
                  <SvgButton
                    type="button"
                    className="mobileButton bg-tr mobileMapBtn"
                    icon={mapIcon}
                    aria-label="지도 보기"
                  />
                  <SvgButton
                    type="button"
                    className="mobileButton bg-tr mobileFilterModalBtn"
                    icon={searchIcon}
                    onClick={onToggleMobileFilterModal}
                    aria-controls="mobileFilterSelectBox"
                    aria-expanded={isMobileFilterModalOpen}
                    aria-label="필터 모달 열기"
                    ref={mobileFilterButtonRef}
                  />
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
                  details={eventDetails}
                />
              </>
            )}
          </main>
        ) : (
          <FeedbackMessage>상세 데이터를 불러오는 중...</FeedbackMessage>
        )
      ) : (
        // 리스트 페이지
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
