// src/components/main/calendar/CalendarDesktopView.jsx
// 캘린더 데스크탑 뷰 컴포넌트

import CalendarHeader from "components/main/calendar/CalendarHeader";
import CalendarFixedCell from "components/main/calendar/CalendarFixedCell";
import CalendarStatus from "components/main/calendar/CalendarStatus";

export default function CalendarDesktopView({
  exhibitions,
  monthsArray,
  activeMonth,
  onHoverMonth,
  onLeaveMonth,
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
        activeMonth={activeMonth}
        monthsArray={monthsArray}
        isDark={isDark}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
      <section className="calendarBoard">
        <CalendarStatus 
          loading={loading} 
          error={error} 
          onRetry={onRetry} 
        />
        {!loading && !error && (
          <CalendarFixedCell
            exhibitions={exhibitions}
            onHoverMonth={onHoverMonth}
            onLeaveMonth={onLeaveMonth}
            monthsArray={monthsArray}
          />
        )}
      </section>
    </>
  );
}
