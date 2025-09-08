// src/pages/EntryPage.jsx
// 보강: 진입 시 1페이지 선패치(캐시 예열)

import { useEffect } from "react";
import Header from "components/header/Header";
import EntryMain from "components/main/EntryMain";

import { useFilterParamsValues } from "hooks/useFilterParamsValues";
import { prefetchFirstPage } from "utils/api";

export default function EntryPage() {
  const { searchParams } = useFilterParamsValues();

  useEffect(() => {
    const ac = new AbortController();
    // 진입 시 현재 필터로 1페이지 예열(실패해도 무해)
    prefetchFirstPage({
      qs: searchParams,
      pageIndex: 1,
      pageSize: 8,
      signal: ac.signal,
    }).catch(() => {});
    return () => ac.abort();
  }, [searchParams]);

  return (
    <>
      <Header />
      <EntryMain />
    </>
  );
}
