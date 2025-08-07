// hooks/useEntries.js
import { useContext, useState, useEffect } from "react";

import { useFilterParams } from "./useFilterParams";
import { EntryContext } from "contexts/EntryContext";
import { fetchData } from "utils/fetchData";

/**
 * 이 훅은 url 쿼리 파라미터가 바뀔때마다 업데이트하는 역할을 합니다.
 *
 * 기능 :
 * 1. 기본적으로 EntryContext에서 가져온 데이터를 사용합니다.
 * 2. 필터링된 데이터를 가져오기 위해 URL 쿼리 파라미터를 사용합니다.
 * 3. 필터링된 데이터가 없을 경우 기본 데이터를 사용합니다.
 * 이 훅은 ListPage.jsx에서 사용됩니다.
 *
 * @returns {{ entries: any[]; loading: boolean; error: Error|null; }}
 */
export function useEntries() {
  const baseEntries = useContext(EntryContext);
  const [searchParams] = useFilterParams();

  const [entries, setEntries] = useState(baseEntries);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const term = searchParams.get("term") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const cate = searchParams.get("cate") || "";
    const sort = searchParams.get("sort") || "";

    const hasFilter = Boolean(term || startDate || endDate || cate || sort);

    if (!hasFilter) {
      // 필터가 없으면 Context 데이터
      setEntries(baseEntries);
      return;
    }

    setLoading(true);

    fetchData(`http://localhost:8000/api/entries/?${searchParams.toString()}`)
      .then((data) => setEntries(data), setError(null))
      .catch((err) => {
        console.error("Entries fetch error:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [searchParams, baseEntries]);

  return { entries, loading, error };
}
