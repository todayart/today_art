import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "contexts/themeContext";

// 페이지 컴포넌트
import EntryPage from "pages/EntryPage";
import ListPage from "pages/ListPage";
import CalendarPage from "pages/CalendarPage.jsx";

// 스타일
import "styles/main/main.css";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/entry" element={<EntryPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
