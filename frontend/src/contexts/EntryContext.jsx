/**
 * EntryProvider 컴포넌트는 자식 컴포넌트에 Entry 데이터를 Context를 통해 제공합니다.
 * 컴포넌트가 마운트되면 지정된 엔드포인트("http://127.0.0.1:8000/entry/")로부터 데이터를 fetch하여 상태를 초기화합니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - Entry 데이터를 사용할 자식 컴포넌트들
 * @returns {JSX.Element} EntryContext.Provider로 감싸진 자식 컴포넌트를 반환합니다.
 */

import { createContext, useState, useEffect, useCallback } from "react";
import { API_BASE } from "utils/api";

export const EntryContext = createContext([]);

export function EntryProvider({ children }) {
  const [entries, setEntries] = useState([]);

  const fetchEntry = useCallback(() => {
    console.log("EntryPage mounted");
    fetch(`${API_BASE}/api/entries/?limit=20`)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
        console.log("API 응답:", data);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, []); // 빈 배열 → fetchEntries는 절대 바뀌지 않음

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  return (
    <EntryContext.Provider value={entries}>{children}</EntryContext.Provider>
  );
}
