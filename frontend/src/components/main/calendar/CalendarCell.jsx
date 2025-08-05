/**
 * 2중 map에서 한 칸(셀)을 렌더링하는 컴포넌트
 */
export default function CalendarCell({ monthIndex, rowIndex, children = "" }) {
  const cellId = `${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`;
  return (
    <div
      className="calendarCell innerCell"
      id={cellId}
      style={{
        gridColumn: monthIndex + 2,
        gridRow: rowIndex + 1,
      }}
    >
      {children}
    </div>
  );
}
