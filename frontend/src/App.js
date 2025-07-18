import "react-datepicker/dist/react-datepicker.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TestPage from "components/test/TestPage";
import EntryPage from "pages/EntryPage";
import ListPage from "pages/ListPage";
import DetailPage from "pages/DetailPage";
import CalenderPage from "pages/CalenderPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 아직 개발단계기 때문에 많이 쓰는 테스트 페이지를 루트에 설정함 */}
        <Route path="/" element={<TestPage />} />
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/calender" element={<CalenderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
