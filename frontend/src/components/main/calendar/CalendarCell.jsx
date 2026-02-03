/**
 * 2개 map으로 각 칸(셀)을 렌더링하는 컴포넌트
 */
export default function CalendarCell({
  monthIndex,
  rowIndex,
  children = "",
  onHoverMonth,
  onLeaveMonth,
}) {
  const cellId = `${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`;
  return (
    <div
      className="calendarCell"
      id={cellId}
      style={{
        gridColumn: monthIndex + 2,
        gridRow: rowIndex + 1,
      }}
      onMouseEnter={() => onHoverMonth?.(monthIndex + 1)}
      onMouseLeave={() => onLeaveMonth?.()}
    >
      <div className="innerCell">{children}</div>
    </div>
  );
}
