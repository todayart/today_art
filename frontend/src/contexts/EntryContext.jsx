/**
 * EntryProvider 컴포넌트는 자식 컴포넌트에 Entry 데이터를 Context를 통해 제공합니다.
 * 컴포넌트가 마운트되면 지정된 엔드포인트("http://127.0.0.1:8000/entry/")로부터 데이터를 fetch하여 상태를 초기화합니다.
 *
 * @component
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - Entry 데이터를 사용할 자식 컴포넌트들
 * @returns {JSX.Element} EntryContext.Provider로 감싸진 자식 컴포넌트를 반환합니다.
 */

import { createContext, useState, useEffect } from "react";

export const EntryContext = createContext([]);

export function EntryProvider({ children }) {
  const [entries, setEntries] = useState([]);

  useEffect(function fetchEntry() {
    console.log("EntryPage mounted");
    // API 호출, http://127.0.0.1:8000/api/entry/로 보낸다.
    fetch("http://127.0.0.1:8000/api/entry/")
      .then((response) => response.json())
      .then(setEntries)
      .then((data) => {
        console.log("API 응답:", data);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, []);

  return (
    <EntryContext.Provider value={entries}>{children}</EntryContext.Provider>
  );
}
