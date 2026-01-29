import { Routes, Route } from "react-router-dom";

// 페이지 컴포넌트
import EntryPage from "pages/EntryPage";
import ListPage from "pages/ListPage";
import CalendarPage from "pages/CalendarPage.jsx";

// 스타일
import "styles/main/main.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("color-theme", currentTheme);
    window.localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <EntryPage
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        }
      />
      <Route
        path="/entry"
        element={
          <EntryPage
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        }
      />
      <Route
        path="/list"
        element={
          <ListPage
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        }
      />
      <Route
        path="/calendar"
        element={
          <CalendarPage
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        }
      />
    </Routes>
  );
}

export default App;
