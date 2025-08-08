import { Routes, Route } from "react-router-dom";

// 페이지 컴포넌트
import TestPage from "./components/test/TestPage.jsx";
import EntryPage from "pages/EntryPage";
import ListPage from "pages/ListPage";
import CalendarPage from "pages/CalendarPage.jsx";

// 스타일
import "styles/main/main.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <Routes>
      {/* 아직 개발단계기 때문에 많이 쓰는 테스트 페이지를 루트에 설정함 */}
      <Route path="/" element={<TestPage />} />
      {/* 8개의 정보를 담아 컨텍스트로 전달 */}
      <Route path="/entry" element={<EntryPage />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
