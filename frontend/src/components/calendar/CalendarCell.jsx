/**
 * 2중 map에서 한 칸(셀)을 렌더링하는 컴포넌트
 * @param {{ monthIndex: number, rowIndex: number, tag?: React.ReactNode }} props
 */
export default function CalendarCell({ monthIndex, rowIndex, tag }) {
  const cellId = `${monthIndex + 1}m-${rowIndex === 0 ? "start" : "end"}`;
  return (
    <div
      className="calendarCell"
      id={cellId}
      style={{
        gridColumn: monthIndex + 2,
        gridRow: rowIndex + 1,
      }}
    >
      {tag /* 전시 태그가 있으면 렌더 */}
    </div>
  );
}
