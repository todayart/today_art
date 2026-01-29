// src/components/main/calendar/CalendarMobileView.jsx
// 캘린더 모바일 뷰 컴포넌트

import CalendarHeader from "components/main/calendar/CalendarHeader";
import CalendarMobileList from "components/main/calendar/CalendarMobileList";
import CalendarStatus from "components/main/calendar/CalendarStatus";

export default function CalendarMobileView({
  exhibitions,
  monthsArray,
  selectedMonth,
  onChangeMonth,
  loading,
  error,
  onRetry,
  isDark = false,
  currentTheme,
  onThemeChange,
}) {
  return (
    <>
      <CalendarHeader
        selectedMonth={selectedMonth}
        onChangeMonth={onChangeMonth}
        monthsArray={monthsArray}
        isDark={isDark}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
      <section className="calendarBoard">
        <CalendarStatus loading={loading} error={error} onRetry={onRetry} />
        {!loading && !error && (
          <CalendarMobileList
            exhibitions={exhibitions}
            selectedMonth={selectedMonth}
            monthsArray={monthsArray}
          />
        )}
      </section>
    </>
  );
}
